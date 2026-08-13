// db.js — connects the server to PostgreSQL
// The "pool" is like a waiting room of database connections.
// We reuse it everywhere instead of opening a new connection each time.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool;
