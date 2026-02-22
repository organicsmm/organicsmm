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

// ─── Parse request body — supports BOTH JSON and form-encoded ───────────────
async function parseBody(req: Request): Promise<Record<string, string>> {
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
        try {
            return await req.json()
        } catch {
            return {}
        }
    }

    // application/x-www-form-urlencoded (most SMM panels use this)
    try {
        const text = await req.text()
        const params: Record<string, string> = {}
        for (const pair of text.split('&')) {
            const [k, v] = pair.split('=')
            if (k) params[decodeURIComponent(k)] = decodeURIComponent(v ?? '')
        }
        return params
    } catch {
        return {}
    }
}

// ─── AUTH: look up user by API key ─────────────────────────────────────────
async function getUserByApiKey(key: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .eq('api_key', key)
        .single()
    if (error || !data) return null
    return data
}

// ─── Responses ──────────────────────────────────────────────────────────────
function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
}

// ────────────────────────────────────────────────────────────────────────────
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await parseBody(req)
        const { key, action, ...params } = body

        console.log(`[public-api] action=${action} content-type=${req.headers.get('content-type')}`)

        // ── Validate API key ────────────────────────────────────────────────────
        if (!key) {
            return json({ status: 'error', error: 'API key is required (field: key)' }, 400)
        }
        const profile = await getUserByApiKey(key)
        if (!profile) {
            return json({ status: 'error', error: 'Invalid API key' }, 401)
        }
        const userId = profile.user_id

        // ── Route ───────────────────────────────────────────────────────────────
        switch (action) {

            // ─── SERVICES ────────────────────────────────────────────────────────
            case 'services': {
                const { data: services, error } = await supabase
                    .from('services')
                    .select('provider_service_id, name, category, price, min_quantity, max_quantity, drip_feed_enabled, description')
                    .eq('is_active', true)
                    .order('category')

                if (error) throw error

                return json({
                    status: 'ok',
                    services: services.map(s => ({
                        service: parseInt(s.provider_service_id) || s.provider_service_id,
                        name: s.name,
                        category: s.category,
                        rate: s.price.toFixed(4),
                        min: s.min_quantity,
                        max: s.max_quantity,
                        dripfeed: s.drip_feed_enabled ?? false,
                        description: s.description ?? '',
                    }))
                })
            }

            // ─── ADD ORDER ───────────────────────────────────────────────────────
            case 'add': {
                const providerServiceId = params.service
                const link = params.link
                const qty = Number(params.quantity)

                if (!providerServiceId) return json({ status: 'error', error: 'service is required' }, 400)
                if (!link) return json({ status: 'error', error: 'link is required' }, 400)
                if (!qty || isNaN(qty)) return json({ status: 'error', error: 'quantity must be a number' }, 400)

                // Lookup service
                const { data: service, error: serviceError } = await supabase
                    .from('services')
                    .select('*')
                    .eq('provider_service_id', String(providerServiceId))
                    .eq('is_active', true)
                    .single()

                if (serviceError || !service) {
                    return json({ status: 'error', error: 'Service not found or inactive' }, 404)
                }

                if (qty < service.min_quantity || qty > service.max_quantity) {
                    return json({
                        status: 'error',
                        error: `Quantity must be between ${service.min_quantity} and ${service.max_quantity}`
                    }, 400)
                }

                const totalPrice = (qty / 1000) * service.price

                // Get wallet
                const { data: wallet, error: walletError } = await supabase
                    .from('wallets')
                    .select('*')
                    .eq('user_id', userId)
                    .single()

                if (walletError || !wallet) return json({ status: 'error', error: 'Wallet not found' }, 404)

                if (wallet.balance < totalPrice) {
                    return json({
                        status: 'error',
                        error: `Insufficient balance. Required: $${totalPrice.toFixed(4)}, Available: $${wallet.balance.toFixed(4)}`
                    }, 402)
                }

                // Create order
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        user_id: userId,
                        service_id: service.id,
                        link,
                        quantity: qty,
                        price: totalPrice,
                        status: 'pending',
                        is_drip_feed: false,
                        is_organic_mode: false,
                        variance_percent: 25,
                        peak_hours_enabled: false,
                    })
                    .select()
                    .single()

                if (orderError || !order) throw orderError

                // Deduct wallet
                const newBalance = wallet.balance - totalPrice
                await supabase
                    .from('wallets')
                    .update({ balance: newBalance, total_spent: (wallet.total_spent || 0) + totalPrice })
                    .eq('user_id', userId)

                // Transaction record
                await supabase.from('transactions').insert({
                    user_id: userId,
                    type: 'order',
                    amount: -totalPrice,
                    balance_after: newBalance,
                    order_id: order.id,
                    description: `API Order #${order.order_number} - ${service.name}`,
                    status: 'completed',
                })

                // Process order (non-blocking)
                supabase.functions.invoke('process-order', {
                    body: { order_id: order.id, run_id: null }
                }).catch((e: Error) => console.error('process-order:', e.message))

                return json({
                    status: 'ok',
                    order: order.order_number,
                    service: service.name,
                    quantity: qty,
                    charge: totalPrice.toFixed(4),
                    balance: newBalance.toFixed(4),
                })
            }

            // ─── ORDER STATUS ─────────────────────────────────────────────────────
            case 'status': {
                const orderNumber = params.order
                if (!orderNumber) return json({ status: 'error', error: 'order number is required' }, 400)

                const { data: order, error } = await supabase
                    .from('orders')
                    .select('order_number, status, quantity, remains, start_count, service:services(name)')
                    .eq('order_number', Number(orderNumber))
                    .eq('user_id', userId)
                    .single()

                if (error || !order) return json({ status: 'error', error: 'Order not found' }, 404)

                return json({
                    status: 'ok',
                    order: {
                        order_number: order.order_number,
                        status: order.status,
                        quantity: order.quantity,
                        remains: order.remains ?? order.quantity,
                        start_count: order.start_count ?? 0,
                        service: (order.service as any)?.name ?? '',
                    }
                })
            }

            // ─── BALANCE ─────────────────────────────────────────────────────────
            case 'balance': {
                const { data: wallet, error } = await supabase
                    .from('wallets')
                    .select('balance')
                    .eq('user_id', userId)
                    .single()

                if (error || !wallet) return json({ status: 'error', error: 'Wallet not found' }, 404)

                return json({
                    status: 'ok',
                    balance: wallet.balance.toFixed(4),
                    currency: 'USD',
                })
            }

            // ─── UNKNOWN ─────────────────────────────────────────────────────────
            default:
                return json({
                    status: 'error',
                    error: `Unknown action: "${action}". Valid: services, add, status, balance`
                }, 400)
        }

    } catch (err: any) {
        console.error('public-api error:', err)
        return json({ status: 'error', error: err.message || 'Internal server error' }, 500)
    }
})
