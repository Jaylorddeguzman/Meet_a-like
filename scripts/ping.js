// Simple ping script to keep Render.com app awake
const https = require('https');

const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET;

const url = `${NEXTAUTH_URL}/api/ping`;

console.log(`Pinging ${url}...`);

const options = {
  method: 'GET',
  headers: CRON_SECRET ? { 'Authorization': `Bearer ${CRON_SECRET}` } : {}
};

const req = (NEXTAUTH_URL.startsWith('https') ? https : require('http')).request(url, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    console.log('Response:', data);
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
});

req.on('error', (error) => {
  console.error('Ping failed:', error);
  process.exit(1);
});

req.end();
