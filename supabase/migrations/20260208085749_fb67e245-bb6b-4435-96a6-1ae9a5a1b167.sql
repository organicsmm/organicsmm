-- Add cron job to check subscription expiry every hour
SELECT cron.schedule(
  'check-subscription-expiry',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://umtfcpopjrxyfjcovgtw.supabase.co/functions/v1/check-subscription-expiry',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);