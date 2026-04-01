require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing UNIVERSAL Connection to cPanel Database...');
  
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ ERROR: DATABASE_URL not found in .env');
    return;
  }

  console.log(`📡 Trying to connect to: ${url.split('@')[1]}`);

  try {
    const connection = await mysql.createConnection(url);
    const [rows] = await connection.execute('SELECT "OK" as result');
    
    console.log('✅ SUCCESS: Your local computer is now connected to the cPanel Database!');
    console.log('📝 Query Result:', rows[0].result);
    
    await connection.end();
    console.log('🔌 Connection closed safely.');
  } catch (err) {
    console.error('❌ CONNECTION FAILED!');
    console.error('Error Details:', err.message);
    console.log('\n--- Troubleshooting ---');
    console.log('1. Did you add "%" to Remote MySQL in cPanel?');
    console.log('2. Is your IP address allowed in cPanel?');
    console.log('3. Is your database username/password correct?');
  }
}

testConnection();
