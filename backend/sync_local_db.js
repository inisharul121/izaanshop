const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('✅ Connected to MySQL');

  const drizzleDir = path.join(__dirname, 'drizzle');
  const files = fs.readdirSync(drizzleDir).filter(f => f.endsWith('.sql'));
  if (files.length === 0) throw new Error('No SQL migration files found in drizzle/');
  
  const sqlFile = path.join(drizzleDir, files[0]);
  console.log('📂 Using migration file:', files[0]);
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  // Drizzle Kit uses '--> statement-breakpoint' to separate statements
  const statements = sqlContent
    .split(/--> statement-breakpoint|;/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    try {
      await connection.query(statement);
      console.log('✅ Executed:', statement.slice(0, 50).replace(/\s+/g, ' ') + '...');
    } catch (err) {
      if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_KEYNAME') {
          console.warn('⚠️ Skipping (already exists):', statement.slice(0, 50).replace(/\s+/g, ' ') + '...');
      } else {
          console.error('❌ Error executing statement:', statement);
          console.error(err);
      }
    }
  }

  await connection.end();
}

run().catch(console.error);
