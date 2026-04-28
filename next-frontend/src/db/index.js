import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";

/**
 * DATABASE SINGLETON
 * 
 * In Next.js Development (HMR), global modules are re-evaluated, 
 * leading to 'Too many connections' errors if we create a pool every time.
 * We use 'globalThis' to ensure exactly ONE pool exists.
 */

const connectionString = process.env.DATABASE_URL;

const connectionOptions = {
  uri: connectionString,
  connectionLimit: 10,
  waitForConnections: true,
  connectTimeout: 5000,
  idleTimeout: 60000,
};

// Singleton pool logic
const globalForMysql = globalThis;
if (!globalForMysql.mysqlPool) {
  globalForMysql.mysqlPool = mysql.createPool(connectionOptions);
}

const pool = globalForMysql.mysqlPool;

export const db = drizzle(pool, { schema, mode: "default" });
