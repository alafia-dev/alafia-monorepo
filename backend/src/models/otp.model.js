const { pool } = require('../config/db');

const createOtpRecord = async ({ phone, otpHash, purpose, expiresAt }) => {
  const result = await pool.query(
    `INSERT INTO otp_codes (phone, otp_hash, purpose, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id, phone, purpose, expires_at, created_at`,
    [phone, otpHash, purpose, expiresAt]
  );
  return result.rows[0];
};

const getActiveOtpByPhone = async ({ phone, purpose }) => {
  const result = await pool.query(
    `SELECT id, phone, otp_hash, purpose, expires_at, consumed_at
     FROM otp_codes
     WHERE phone = $1
       AND purpose = $2
       AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [phone, purpose]
  );
  return result.rows[0] || null;
};

const consumeOtp = async (id) => {
  await pool.query('UPDATE otp_codes SET consumed_at = NOW() WHERE id = $1', [id]);
};

module.exports = {
  createOtpRecord,
  getActiveOtpByPhone,
  consumeOtp,
};
