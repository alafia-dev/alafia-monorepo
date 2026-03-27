require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { Pool } = require('pg');

const seed = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in backend/.env');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const adminPhone = '+2348000000099';
    const adminResult = await pool.query(
      `INSERT INTO users (first_name, last_name, phone, email, role)
       VALUES ('System', 'Admin', $1, 'admin@alafia.local', 'admin')
       ON CONFLICT (phone)
       DO UPDATE SET role = 'admin', updated_at = NOW()
       RETURNING id, first_name, last_name, phone, role`,
      [adminPhone]
    );

    const admin = adminResult.rows[0];

    await pool.query(
      `INSERT INTO user_subscriptions (user_id, tier_id, is_active)
       SELECT $1, st.id, TRUE
       FROM subscription_tiers st
       WHERE st.name = 'enterprise'
       ON CONFLICT (user_id)
       DO UPDATE SET tier_id = EXCLUDED.tier_id, is_active = TRUE`,
      [admin.id]
    );

    await pool.query(
      `INSERT INTO subscription_tier_features (tier_id, feature_flag_id, is_enabled)
       SELECT st.id, ff.id, TRUE
       FROM subscription_tiers st
       CROSS JOIN feature_flags ff
       WHERE st.name = 'enterprise'
       ON CONFLICT (tier_id, feature_flag_id)
       DO UPDATE SET is_enabled = TRUE`
    );

    console.log('Seed completed. Admin user:', admin);
  } finally {
    await pool.end();
  }
};

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
