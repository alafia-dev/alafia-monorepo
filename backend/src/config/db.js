const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const query = (text, params) => pool.query(text, params);

const testDbConnection = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set yet. Skipping DB connection test.');
    return;
  }

  await pool.query('SELECT 1');
  console.log('PostgreSQL connected');
};

module.exports = {
  pool,
  query,
  testDbConnection,
};
