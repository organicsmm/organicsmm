import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Not authenticated");

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) throw new Error("Admin access required");

    // Optional: sync only specific service IDs
    const body = await req.json().catch(() => ({}));
    const targetServiceIds: string[] | null = body.service_ids || null;

    // Get all service_provider_mappings with provider account details
    let mappingQuery = supabase
      .from("service_provider_mapping")
      .select("service_id, provider_service_id, provider_account_id, provider_accounts!inner(api_url, api_key, name)")
      .eq("is_active", true);

    if (targetServiceIds && targetServiceIds.length > 0) {
      mappingQuery = mappingQuery.in("service_id", targetServiceIds);
    }

    const { data: mappings, error: mapError } = await mappingQuery;
    if (mapError) throw mapError;
    if (!mappings || mappings.length === 0) {
      return new Response(JSON.stringify({ message: "No mappings found", updated: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Group mappings by service_id
    const serviceMap: Record<string, Array<{
      providerServiceId: string;
      apiUrl: string;
      apiKey: string;
      accountName: string;
    }>> = {};

    for (const m of mappings) {
      const sid = m.service_id;
      if (!sid) continue;
      const account = (m as any).provider_accounts;
      if (!account) continue;

      if (!serviceMap[sid]) serviceMap[sid] = [];
      serviceMap[sid].push({
        providerServiceId: m.provider_service_id,
        apiUrl: account.api_url,
        apiKey: account.api_key,
        accountName: account.name,
      });
    }

    const results: Array<{ serviceId: string; oldPrice: number; newPrice: number; source: string }> = [];
    const errors: Array<{ serviceId: string; error: string }> = [];

    // Get current prices for all services we'll update
    const serviceIds = Object.keys(serviceMap);
    const { data: currentServices } = await supabase
      .from("services")
      .select("id, price, name")
      .in("id", serviceIds);
    const currentPriceMap: Record<string, { price: number; name: string }> = {};
    (currentServices || []).forEach(s => { currentPriceMap[s.id] = { price: s.price, name: s.name }; });

    // For each service, query all mapped providers and find highest rate
    for (const [serviceId, providers] of Object.entries(serviceMap)) {
      let highestRate = 0;
      let highestSource = "";

      // Query each provider in parallel
      const ratePromises = providers.map(async (p) => {
        try {
          const url = `${p.apiUrl}?key=${p.apiKey}&action=services&service=${p.providerServiceId}`;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeout);

          if (!response.ok) return null;

          const data = await response.json();

          // API can return array of services or single object
          let rate = 0;
          if (Array.isArray(data)) {
            // Find the exact service in the array
            const found = data.find((s: any) => String(s.service) === String(p.providerServiceId));
            if (found) rate = parseFloat(found.rate) || 0;
          } else if (data && data.rate) {
            rate = parseFloat(data.rate) || 0;
          }

          console.log(`[RATE] ${p.accountName} service=${p.providerServiceId} rate=${rate} (raw response items: ${Array.isArray(data) ? data.length : 'object'})`);
          return { rate, source: p.accountName, providerServiceId: p.providerServiceId };
        } catch (e) {
          console.error(`Error fetching rate from ${p.accountName} for service ${p.providerServiceId}:`, e);
          return null;
        }
      });

      const rateResults = await Promise.all(ratePromises);

      for (const r of rateResults) {
        if (r && r.rate > highestRate) {
          highestRate = r.rate;
          highestSource = `${r.source} (${r.providerServiceId})`;
        }
      }

      if (highestRate > 0) {
        const oldPrice = currentPriceMap[serviceId]?.price ?? 0;

        // Update service price to highest provider rate
        const { error: updateError } = await supabase
          .from("services")
          .update({ price: highestRate })
          .eq("id", serviceId);

        if (updateError) {
          errors.push({ serviceId, error: updateError.message });
        } else {
          results.push({
            serviceId,
            oldPrice,
            newPrice: highestRate,
            source: highestSource,
          });
        }
      } else {
        errors.push({ serviceId, error: "No valid rate found from any provider" });
      }
    }

    return new Response(JSON.stringify({
      message: `Synced ${results.length} service prices`,
      updated: results.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("sync-service-prices error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
