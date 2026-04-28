const { defineConfig } = require("drizzle-kit");
require("dotenv").config({ path: ".env" });

module.exports = defineConfig({
  schema: "./db/schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "mysql://root:@localhost:3306/izaanshop",
  },
});
