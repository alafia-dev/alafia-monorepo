const { pool } = require('../config/db');

const getUserSubscription = async (userId) => {
  const result = await pool.query(
    `SELECT us.id, us.user_id, us.starts_at, us.ends_at, us.is_active,
            st.name AS tier_name, st.display_name
     FROM user_subscriptions us
     JOIN subscription_tiers st ON st.id = us.tier_id
     WHERE us.user_id = $1
       AND us.is_active = TRUE
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
};

const setUserTier = async ({ userId, tierName }) => {
  const tierResult = await pool.query(
    'SELECT id FROM subscription_tiers WHERE name = $1 LIMIT 1',
    [tierName]
  );

  if (!tierResult.rows[0]) {
    return null;
  }

  const tierId = tierResult.rows[0].id;

  const result = await pool.query(
    `INSERT INTO user_subscriptions (user_id, tier_id, is_active)
     VALUES ($1, $2, TRUE)
     ON CONFLICT (user_id)
     DO UPDATE SET tier_id = EXCLUDED.tier_id, is_active = TRUE
     RETURNING id, user_id, tier_id, is_active, starts_at`,
    [userId, tierId]
  );

  return result.rows[0];
};

const listEnabledFeaturesForUser = async (userId) => {
  const result = await pool.query(
    `SELECT ff.key,
            COALESCE(stf.is_enabled, ff.is_globally_enabled) AS enabled
     FROM feature_flags ff
     LEFT JOIN user_subscriptions us ON us.user_id = $1 AND us.is_active = TRUE
     LEFT JOIN subscription_tiers st ON st.id = us.tier_id
     LEFT JOIN subscription_tier_features stf ON stf.feature_flag_id = ff.id AND stf.tier_id = st.id
     ORDER BY ff.key ASC`,
    [userId]
  );

  return result.rows;
};

module.exports = {
  getUserSubscription,
  setUserTier,
  listEnabledFeaturesForUser,
};
