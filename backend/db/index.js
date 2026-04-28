const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");
const schema = require("./schema");
require("dotenv").config();

// On cPanel shared hosting MySQL enforces a hard connection cap (~15-20 total).
// connectionLimit: 5 leaves headroom for other processes and prevents timeouts.
const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 5,        // CRITICAL: keeps us under cPanel MySQL connection cap
  waitForConnections: true,  // Queue requests instead of throwing immediately
  queueLimit: 0,             // Unlimited queue (prevents request drops under burst load)
  connectTimeout: 10000,     // 10s to establish connection (allows for cold starts)
  idleTimeout: 30000,        // Release idle connections after 30s to free MySQL resources
});

const db = drizzle(poolConnection, { schema, mode: "default" });

module.exports = { db, poolConnection };
