-- =====================================================================
-- PROVIDER DIAGNOSTIC + FIX SCRIPT
-- Run this in Supabase SQL Editor to diagnose and fix provider issues
-- =====================================================================

-- STEP 1: Check current state
SELECT '=== PROVIDERS TABLE ===' as section;
SELECT id, name, api_url, is_active FROM public.providers;

SELECT '=== PROVIDER ACCOUNTS TABLE ===' as section;
SELECT id, name, provider_id, api_url, is_active, last_used_at FROM public.provider_accounts;

SELECT '=== SERVICE_PROVIDER_MAPPING (total count) ===' as section;
SELECT COUNT(*) as total_mappings FROM public.service_provider_mapping;

SELECT '=== SERVICES WITH NO MAPPINGS (problem!) ===' as section;
SELECT s.id, s.name, s.provider_service_id, s.provider_id, p.name as provider_name
FROM public.services s
LEFT JOIN public.provider_accounts pa ON pa.id IN (
  SELECT provider_account_id FROM public.service_provider_mapping WHERE service_id = s.id AND is_active = true
)
LEFT JOIN public.providers p ON p.id = s.provider_id::uuid
WHERE s.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM public.service_provider_mapping spm WHERE spm.service_id = s.id AND spm.is_active = true
  )
LIMIT 20;

-- =====================================================================
-- STEP 2: AUTO-FIX
-- For every provider in 'providers' table that has NO corresponding
-- provider_account, create one automatically.
-- Then for every service using that provider, create a mapping.
-- =====================================================================

-- 2a: Create provider_accounts from existing providers if not already there
INSERT INTO public.provider_accounts (provider_id, name, api_key, api_url, priority, is_active)
SELECT 
  p.id::text,
  p.name,
  p.api_key,
  p.api_url,
  1,
  p.is_active
FROM public.providers p
WHERE NOT EXISTS (
  SELECT 1 FROM public.provider_accounts pa 
  WHERE pa.provider_id = p.id::text 
    AND pa.api_url = p.api_url
);

SELECT '=== PROVIDER ACCOUNTS AFTER FIX ===' as section;
SELECT id, name, provider_id, is_active FROM public.provider_accounts;

-- 2b: Create service_provider_mapping for all active services that have none
-- This links existing provider accounts to services they should handle
INSERT INTO public.service_provider_mapping (service_id, provider_account_id, provider_service_id, sort_order, is_active)
SELECT 
  s.id as service_id,
  pa.id as provider_account_id,
  s.provider_service_id,
  1 as sort_order,
  true as is_active
FROM public.services s
JOIN public.provider_accounts pa ON pa.provider_id = s.provider_id::text
WHERE s.is_active = true
  AND s.provider_service_id IS NOT NULL
  AND s.provider_service_id != ''
  AND NOT EXISTS (
    SELECT 1 FROM public.service_provider_mapping spm 
    WHERE spm.service_id = s.id 
      AND spm.provider_account_id = pa.id
  )
ON CONFLICT (service_id, provider_account_id) DO NOTHING;

-- STEP 3: Verify the fix
SELECT '=== SERVICE_PROVIDER_MAPPING AFTER FIX ===' as section;
SELECT 
  spm.id,
  s.name as service_name,
  pa.name as provider_account_name,
  spm.provider_service_id,
  spm.sort_order,
  spm.is_active
FROM public.service_provider_mapping spm
JOIN public.services s ON s.id = spm.service_id
JOIN public.provider_accounts pa ON pa.id = spm.provider_account_id
WHERE spm.is_active = true
LIMIT 30;

SELECT '=== STILL UNMAPPED SERVICES ===' as section;
SELECT s.id, s.name, s.provider_service_id, s.provider_id
FROM public.services s
WHERE s.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM public.service_provider_mapping spm WHERE spm.service_id = s.id AND spm.is_active = true
  );

-- STEP 4: Fix stuck runs (reset any runs stuck in 'started' for too long)
SELECT '=== STUCK RUNS BEING FIXED ===' as section;
UPDATE public.organic_run_schedule
SET 
  status = 'pending',
  started_at = NULL,
  provider_account_id = NULL,
  provider_order_id = NULL,
  error_message = 'Reset by admin - provider fix'
WHERE status = 'started'
  AND started_at < NOW() - INTERVAL '15 minutes'
RETURNING id, run_number, started_at;

-- STEP 5: Show pending runs waiting to be processed
SELECT '=== PENDING RUNS WAITING ===' as section;
SELECT 
  ors.id,
  ors.run_number,
  ors.status,
  ors.scheduled_at,
  ors.quantity_to_send,
  ors.retry_count,
  eoi.engagement_type,
  eo.link
FROM public.organic_run_schedule ors
LEFT JOIN public.engagement_order_items eoi ON eoi.id = ors.engagement_order_item_id
LEFT JOIN public.engagement_orders eo ON eo.id = eoi.engagement_order_id
WHERE ors.status = 'pending'
  AND ors.scheduled_at <= NOW()
ORDER BY ors.scheduled_at ASC
LIMIT 20;
