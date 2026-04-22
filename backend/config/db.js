const { Pool } = require('pg');

// Supabase PostgreSQL direct connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Supabase requires SSL always
});

pool.connect()
  .then(() => console.log('✅ Supabase PostgreSQL Connected'))
  .catch(err => console.error('❌ DB Error:', err.message));

module.exports = pool;
