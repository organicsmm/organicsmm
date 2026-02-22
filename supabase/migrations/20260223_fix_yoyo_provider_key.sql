-- Update yoyo provider API key and URL
UPDATE provider_accounts 
SET 
  api_key = '1bf4919406baace233cda2aa0cd195d8e28a92c14cd2f082bb7e1b4f0411a862',
  api_url = 'https://yoyomedia.in/api/v2'
WHERE name ILIKE '%yoyo%' OR provider_id ILIKE '%yoyo%';

UPDATE providers 
SET 
  api_key = '1bf4919406baace233cda2aa0cd195d8e28a92c14cd2f082bb7e1b4f0411a862',
  api_url = 'https://yoyomedia.in/api/v2'
WHERE name ILIKE '%yoyo%' OR id ILIKE '%yoyo%';
