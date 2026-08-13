// scripts/setup-db.js — creates the full schema + default admin on ANY Postgres.
// Works against Vercel Postgres (just pass its connection string).
//
// Usage (from the server/ folder):
//   npm run db:setup -- "postgres://your-vercel-postgres-url"
//   or set DATABASE_URL first:
//   $env:DATABASE_URL = "postgres://..." ; npm run db:setup

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.argv[2];

if (!DATABASE_URL) {
  console.error('No database URL found. Pass it as an argument or set DATABASE_URL.');
  process.exit(1);
}

const schema = fs.readFileSync(path.join(__dirname, '..', '..', 'database', 'schema.sql'), 'utf8');
const migrate = fs.readFileSync(path.join(__dirname, '..', '..', 'database', 'migrate-cms.sql'), 'utf8');

async function main() {
  // Strip ?sslmode=... so it doesn't override our ssl option (Supabase certs
  // are not in Node's trust store, so we connect encrypted without host check).
  const connectionString = DATABASE_URL.split('?')[0];
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected. Creating tables...');

  await client.query(schema);
  await client.query(migrate);

  // default admin so you can log in immediately
  const hash = await bcrypt.hash('admin123', 10);
  await client.query(
    'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
    ['admin', hash]
  );

  console.log('Database ready.');
  console.log('Default admin -> username: admin | password: admin123');
  await client.end();
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
