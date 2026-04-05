import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Global Balance Cache
const balanceCache = new Map<string, { balance: number; checkedAt: number }>()

interface ProviderAccount {
  id: string
  provider_id: string
  name: string
  api_key: string
  api_url: string
  priority: number
  is_active: boolean
  last_used_at: string | null
}

interface ServiceMapping {
  id: string
  service_id: string
  provider_account_id: string
  provider_service_id: string
  sort_order: number
  is_active: boolean
}

// Module-level Supabase client
const supabaseModule = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Helper: Check provider balance
async function checkProviderBalance(account: ProviderAccount): Promise<{ hasBalance: boolean; balance: number }> {
  const cached = balanceCache.get(account.id)
  if (cached && Date.now() - cached.checkedAt < 30000) {
    return { hasBalance: cached.balance > 0, balance: cached.balance }
  }

  try {
    const formData = new URLSearchParams()
    formData.append('key', account.api_key)
    formData.append('action', 'balance')

    const response = await fetch(account.api_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })

    const result = await response.json()
    
    // If API returns an error message instead of balance, don't assume 0 balance
    // This allows the main loop to try and report the actual API error
    if (result.error || result.message) {
      console.log(`[BalanceCheck] Provider ${account.name} returned error: ${result.error || result.message}`)
      return { hasBalance: true, balance: -1 }
    }

    const balanceStr = (result.balance || result.funds || result.amount || '-1').toString()
    const balance = parseFloat(balanceStr)
    
    balanceCache.set(account.id, { balance, checkedAt: Date.now() })
    
    // Only block if we truly got a successful '0' or negative balance
    return { hasBalance: balance !== 0, balance }
  } catch (e: any) {
    console.log(`[BalanceCheck] Failed for ${account.name}: ${e.message}`)
    return { hasBalance: true, balance: -1 }
  }
}

// Context Pre-fetcher
async function getExecutionContext(supabase: SupabaseClient) {
  const { data: accounts, error: accErr } = await supabase.from('provider_accounts').select('*').eq('is_active', true).order('priority', { ascending: true })
  const { data: mappings, error: mapErr } = await supabase.from('service_provider_mapping').select('*').eq('is_active', true).order('sort_order', { ascending: true })
  
  if (accErr) console.error('Error fetching accounts:', accErr)
  if (mapErr) console.error('Error fetching mappings:', mapErr)

  console.log(`Context: Found ${accounts?.length || 0} active accounts and ${mappings?.length || 0} active mappings.`)
  
  return {
    accounts: (accounts || []) as ProviderAccount[],
    mappings: (mappings || []) as ServiceMapping[]
  }
}

// Account Finder
function getAvailableAccountsForService(
  context: { accounts: ProviderAccount[], mappings: ServiceMapping[] },
  serviceId: string,
  link: string,
  allStartedRuns: any[] = []
): (ProviderAccount & { providerServiceId: string })[] {
  const normalizedLink = link.toLowerCase().trim().replace(/\/$/, '')
  const serviceMappings = context.mappings.filter(m => m.service_id === serviceId)
  
  const available: (ProviderAccount & { providerServiceId: string })[] = []
  
  for (const m of serviceMappings) {
    const acc = context.accounts.find(a => a.id === m.provider_account_id)
    if (!acc) continue

    // Link-concurrency check: 
    // Is this account ALREADY busy with a run for the SAME LINK?
    // We only block if the status is 'started' (active at provider)
    const isBusy = (allStartedRuns || []).some(r => 
      r.provider_account_id === acc.id && 
      r.engagement_order_item?.engagement_order?.link?.toLowerCase().trim().replace(/\/$/, '') === normalizedLink
    )

    if (!isBusy) {
      available.push({ ...acc, providerServiceId: m.provider_service_id })
    } else {
      console.log(`  Account ${acc.name} is busy with link ${normalizedLink}`)
    }
  }
  return available
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const executionId = crypto.randomUUID().slice(0, 8)
  const supabase = supabaseModule
  const now = new Date().toISOString()
  
  let processed = 0, failed = 0, skipped = 0, results = []

  try {
    console.log(`🚀 EXECUTION START [${executionId}]`)

    // 0. Auto-Cleanup stuck runs (> 10 mins)
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    
    // Runs that actually reached provider - mark as completed to unblock queue
    await supabase.from('organic_run_schedule').update({
      status: 'completed',
      error_message: 'Auto-completed (stuck > 10min with provider ID)',
      completed_at: new Date().toISOString()
    }).eq('status', 'started').lte('started_at', tenMinAgo).not('provider_order_id', 'is', null)

    // Runs that crashed before reaching provider - revert to pending
    await supabase.from('organic_run_schedule').update({
      status: 'pending',
      started_at: null,
      error_message: 'Reverted to pending (stuck > 10min without provider ID)',
    }).eq('status', 'started').lte('started_at', tenMinAgo).is('provider_order_id', null)

    // 1. Snapshot started runs (use inner joins to avoid orbits)
    const { data: allStartedRuns } = await supabase
      .from('organic_run_schedule')
      .select('*, engagement_order_item:engagement_order_items!inner(*, engagement_order:engagement_orders!inner(*))')
      .eq('status', 'started')

    // 2. Pre-fetch Context
    const context = await getExecutionContext(supabase)

    // 3. Fetch Pending Runs (CRITICAL: Use !inner to skip orphaned runs at DB level)
    const { data: pendingRuns } = await supabase
      .from('organic_run_schedule')
      .select('*, engagement_order_item:engagement_order_items!inner(*, engagement_order:engagement_orders!inner(*), service:services(*))')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date(Date.now() + 2 * 60 * 1000).toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(50)

    const activeRuns = (pendingRuns || []).filter(r => 
      r.engagement_order_item && 
      r.engagement_order_item.engagement_order &&
      r.engagement_order_item.engagement_order.status !== 'cancelled' &&
      r.engagement_order_item.status !== 'cancelled'
    )

    console.log(`[${executionId}] Found ${activeRuns.length} valid pending runs (out of ${pendingRuns?.length || 0} queried)`)

    // DEDUPLICATION: 1 run per item per cycle
    const itemsProcessedInThisBatch = new Set<string>()

    for (const run of activeRuns) {
      const item = run.engagement_order_item
      const itemId = run.engagement_order_item_id
      if (itemsProcessedInThisBatch.has(itemId) || (allStartedRuns || []).some(r => r.engagement_order_item_id === itemId)) {
        continue
      }
      itemsProcessedInThisBatch.add(itemId)

      const link = item.engagement_order.link
      console.log(`[${executionId}] Processing Run #${run.run_number} (Item: ${itemId}) for ${link}`)

      // Step 1: Get providers
      let accountsToTry = getAvailableAccountsForService(context, item.service_id, link, allStartedRuns)

      if (accountsToTry.length === 0) {
        console.log(`[${executionId}] Run #${run.run_number} for link ${link}: No providers available.`)
        skipped++
        continue
      }

      // Step 2: Claim Run
      const { count } = await supabase.from('organic_run_schedule').update({
        status: 'started',
        started_at: new Date().toISOString(),
        error_message: `Claimed by [${executionId}]`
      }, { count: 'exact' }).eq('id', run.id).eq('status', 'pending')

      if (count === 0) continue

      // Step 3: Provider Failover Loop
      let success = false, providerOrderId = null, successAcc = null, lastErr = 'None'

      for (const account of accountsToTry) {
        const { hasBalance } = await checkProviderBalance(account)
        if (!hasBalance) { lastErr = 'No balance'; continue }

        try {
          const formData = new URLSearchParams()
          formData.append('key', account.api_key); formData.append('action', 'add')
          formData.append('service', account.providerServiceId); formData.append('link', link)
          formData.append('quantity', run.quantity_to_send.toString())

          const resp = await fetch(account.api_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
          })

          const res = await resp.json()
          if (res.order || res.id) {
            providerOrderId = res.order || res.id
            success = true; successAcc = account; break
          } else {
            lastErr = res.error || res.message || 'Unknown'
            console.log(`Provider ${account.name} rejected: ${lastErr}`)
          }
        } catch (e: any) {
          lastErr = e.message
        }
      }

      // Step 4: Finalize (Wait Mode)
      if (success && providerOrderId && successAcc) {
        // IMPORTANT: We keep status as 'started' - check-order-status cron will mark 'completed'
        // This prevents the next run for the same link from starting until this one is truly done.
        await supabase.from('organic_run_schedule').update({
          status: 'started',
          provider_order_id: providerOrderId.toString(),
          provider_account_id: successAcc.id,
          provider_account_name: successAcc.name,
          error_message: null
        }).eq('id', run.id)
        
        await supabase.from('engagement_order_items').update({ status: 'processing' }).eq('id', item.id)
        processed++
        results.push({ run_id: run.id, success: true, order_id: providerOrderId })
        console.log(`[${executionId}] Run #${run.run_number} placed at ${successAcc.name}, ID: ${providerOrderId}. Now waiting for provider completion.`)
      } else if (!success) {
        // Backoff and retry
        await supabase.from('organic_run_schedule').update({
          status: 'pending',
          started_at: null,
          scheduled_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          error_message: `Failover failed: ${lastErr}`,
          retry_count: (run.retry_count || 0) + 1
        }).eq('id', run.id)
        failed++
      }

      await new Promise(r => setTimeout(r, 100))
    }

    console.log(`✅ EXECUTION COMPLETE: ${processed} processed, ${failed} failed`)

    return new Response(JSON.stringify({ success: true, processed, failed, skipped }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('CRITICAL ERROR:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
