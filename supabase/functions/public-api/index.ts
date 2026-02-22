import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// ─── Parse body: JSON OR form-encoded ───────────────────────────────────────
async function parseBody(req: Request): Promise<Record<string, string>> {
    const ct = req.headers.get('content-type') || ''
    try {
        if (ct.includes('application/json')) {
            return await req.json()
        }
        // form-encoded: key=X&action=balance (what most SMM panels send)
        const text = await req.text()
        const params: Record<string, string> = {}
        for (const pair of text.split('&')) {
            const idx = pair.indexOf('=')
            if (idx === -1) continue
            const k = decodeURIComponent(pair.slice(0, idx).trim())
            const v = decodeURIComponent(pair.slice(idx + 1).trim())
            if (k) params[k] = v
        }
        return params
    } catch {
        return {}
    }
}

// ─── JSON response helper ────────────────────────────────────────────────────
function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
}

// ─── Error response (standard SMM API format) ────────────────────────────────
function err(msg: string, status = 400) {
    return json({ error: msg }, status)
}

// ─── Lookup user by API key ──────────────────────────────────────────────────
async function getUserByKey(key: string) {
    const { data } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('api_key', key.trim())
        .single()
    return data?.user_id ?? null
}

// ────────────────────────────────────────────────────────────────────────────
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await parseBody(req)
        const { key, action } = body

        console.log(`[public-api] action="${action}" ct="${req.headers.get('content-type')}"`)

        // ── Auth ────────────────────────────────────────────────────────────────
        if (!key) return err('API key required (field: key)', 401)
        const userId = await getUserByKey(key)
        if (!userId) return err('Invalid API key', 401)

        // ── Routes ──────────────────────────────────────────────────────────────
        switch (action) {

            // ─────────── BALANCE ───────────────────────────────────────────────
            // Standard format: {"balance":"1.00","currency":"USD"}
            case 'balance': {
                const { data: w } = await supabase
                    .from('wallets').select('balance').eq('user_id', userId).single()
                if (!w) return err('Wallet not found', 404)
                return json({ balance: w.balance.toFixed(2), currency: 'USD' })
            }

            // ─────────── SERVICES ──────────────────────────────────────────────
            // Standard format: [{"service":1,"name":"...","rate":"0.50","min":100,"max":50000,...}]
            case 'services': {
                const { data: services, error } = await supabase
                    .from('services')
                    .select('provider_service_id, name, category, price, min_quantity, max_quantity, drip_feed_enabled, description')
                    .eq('is_active', true)
                    .order('category')
                if (error) throw error
                return json(services.map(s => ({
                    service: parseInt(s.provider_service_id) || s.provider_service_id,
                    name: s.name,
                    category: s.category,
                    rate: s.price.toFixed(4),
                    min: s.min_quantity,
                    max: s.max_quantity,
                    dripfeed: s.drip_feed_enabled ?? false,
                    description: s.description ?? '',
                })))
            }

            // ─────────── ADD ORDER ─────────────────────────────────────────────
            // Standard format: {"order":12345}
            case 'add': {
                const providerSvcId = body.service
                const link = body.link
                const qty = Number(body.quantity)

                if (!providerSvcId) return err('service is required')
                if (!link) return err('link is required')
                if (!qty || isNaN(qty)) return err('quantity must be a number')

                const { data: svc } = await supabase
                    .from('services')
                    .select('*')
                    .eq('provider_service_id', String(providerSvcId))
                    .eq('is_active', true)
                    .single()

                if (!svc) return err('Service not found or inactive', 404)
                if (qty < svc.min_quantity || qty > svc.max_quantity) {
                    return err(`Quantity must be between ${svc.min_quantity} and ${svc.max_quantity}`)
                }

                const totalPrice = (qty / 1000) * svc.price

                const { data: wallet } = await supabase
                    .from('wallets').select('*').eq('user_id', userId).single()
                if (!wallet) return err('Wallet not found', 404)
                if (wallet.balance < totalPrice) {
                    return err(`Insufficient balance. Need $${totalPrice.toFixed(4)}, have $${wallet.balance.toFixed(4)}`)
                }

                const { data: order, error: oErr } = await supabase
                    .from('orders')
                    .insert({
                        user_id: userId,
                        service_id: svc.id,
                        link,
                        quantity: qty,
                        price: totalPrice,
                        status: 'pending',
                        is_drip_feed: false,
                        is_organic_mode: false,
                        variance_percent: 25,
                        peak_hours_enabled: false,
                    })
                    .select().single()

                if (oErr || !order) throw oErr

                const newBal = wallet.balance - totalPrice
                await supabase.from('wallets')
                    .update({ balance: newBal, total_spent: (wallet.total_spent || 0) + totalPrice })
                    .eq('user_id', userId)

                await supabase.from('transactions').insert({
                    user_id: userId,
                    type: 'order',
                    amount: -totalPrice,
                    balance_after: newBal,
                    order_id: order.id,
                    description: `API Order #${order.order_number} - ${svc.name}`,
                    status: 'completed',
                })

                // Fire & forget
                supabase.functions.invoke('process-order', { body: { order_id: order.id } })
                    .catch((e: Error) => console.error('process-order:', e.message))

                return json({ order: order.order_number })
            }

            // ─────────── ORDER STATUS ──────────────────────────────────────────
            // Standard format: {"charge":"0.50","start_count":"3572","status":"Partial","remains":"157","currency":"USD"}
            case 'status': {
                if (!body.order) return err('order is required')

                const { data: order } = await supabase
                    .from('orders')
                    .select('order_number, status, quantity, remains, start_count, price, service:services(name)')
                    .eq('order_number', Number(body.order))
                    .eq('user_id', userId)
                    .single()

                if (!order) return err('Order not found', 404)

                // Map internal status to standard SMM status
                const statusMap: Record<string, string> = {
                    pending: 'Pending',
                    processing: 'In progress',
                    completed: 'Completed',
                    failed: 'Canceled',
                    partial: 'Partial',
                }

                return json({
                    charge: order.price.toFixed(4),
                    start_count: String(order.start_count ?? 0),
                    status: statusMap[order.status ?? 'pending'] ?? order.status,
                    remains: String(order.remains ?? order.quantity),
                    currency: 'USD',
                })
            }

            // ─────────── UNKNOWN ───────────────────────────────────────────────
            default:
                return err(`Unknown action "${action}". Valid: balance, services, add, status`)
        }

    } catch (e: any) {
        console.error('[public-api]', e)
        return err(e.message || 'Internal server error', 500)
    }
})
