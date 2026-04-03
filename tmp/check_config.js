
const https = require('https');

const SUPABASE_URL = 'nenuwlbnaxesmnpfjlrl.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbnV3bGJuYXhlc21ucGZqbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1OTY3MjksImV4cCI6MjA4ODE3MjcyOX0.DM1vKF5CJxrwg5T_XJE_nr5LTNtr4pKNkTQUqvPhuiY';

function request(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: SUPABASE_URL,
            path: path,
            method: 'GET',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch {
                    resolve(data);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    console.log('--- Services ---\n');
    const services = await request('/rest/v1/services?select=id,name,is_active,provider_id&limit=5');
    console.log(JSON.stringify(services, null, 2));

    console.log('\n--- Provider Accounts ---\n');
    const accounts = await request('/rest/v1/provider_accounts?select=id,name,is_active&limit=5');
    console.log(JSON.stringify(accounts, null, 2));

    console.log('\n--- Provider Mappings ---\n');
    const mappings = await request('/rest/v1/service_provider_mapping?select=id,service_id,provider_account_id,is_active&limit=5');
    console.log(JSON.stringify(mappings, null, 2));
}

main().catch(console.error);
