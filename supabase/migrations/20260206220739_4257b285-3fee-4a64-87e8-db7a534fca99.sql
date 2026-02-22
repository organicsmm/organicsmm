-- Update cron job to use execute-all-runs instead of execute-organic-runs
-- This function handles BOTH legacy orders AND engagement orders
SELECT cron.unschedule(4);

SELECT cron.schedule(
  'execute-all-runs-cron',
  '* * * * *', -- Every minute
  $$
  SELECT extensions.http_post(
    url:='https://umtfcpopjrxyfjcovgtw.supabase.co/functions/v1/execute-all-runs',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdGZjcG9wanJ4eWZqY292Z3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODU0MTEsImV4cCI6MjA4NTk2MTQxMX0.uvuoonRKHz37OMRGM1b-n6aVo1h9IvxBmWrIxlCojBs"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);