const { pool } = require('../config/db');

const getDidWalletByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, did, wallet_provider, is_active, created_at, updated_at
     FROM did_wallets
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
};

const upsertDidWallet = async ({ userId, did, walletProvider }) => {
  const result = await pool.query(
    `INSERT INTO did_wallets (user_id, did, wallet_provider)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id)
     DO UPDATE SET did = EXCLUDED.did, wallet_provider = EXCLUDED.wallet_provider, updated_at = NOW(), is_active = TRUE
     RETURNING id, user_id, did, wallet_provider, is_active, created_at, updated_at`,
    [userId, did, walletProvider || null]
  );
  return result.rows[0];
};

module.exports = {
  getDidWalletByUserId,
  upsertDidWallet,
};
