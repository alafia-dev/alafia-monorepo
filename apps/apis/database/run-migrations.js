require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const run = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in backend/.env');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  const schemaPath = path.resolve(__dirname, './schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('Migrations applied successfully from database/schema.sql');
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
