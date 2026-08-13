// db.js — connects the server to PostgreSQL
// The "pool" is like a waiting room of database connections.
// We reuse it everywhere instead of opening a new connection each time.
//
// Locally it reads DB_USER / DB_PASSWORD / ... from server/.env.
// On Vercel it uses DATABASE_URL (or POSTGRES_URL) provided by Vercel Postgres.

const { Pool } = require('pg');
require('dotenv').config();

// Strip any ?sslmode=... query so node-postgres doesn't treat it as verify-full
// and override the ssl option below (Supabase certs are not in Node's trust store).
const connectionString = (process.env.DATABASE_URL || process.env.POSTGRES_URL || '').split('?')[0] || undefined;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    })
  : new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      connectionTimeoutMillis: 10000,
    });

module.exports = pool;
