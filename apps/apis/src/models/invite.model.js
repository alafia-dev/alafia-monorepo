const { pool } = require('../config/db');

const createInvite = async ({ hospitalId, phone, email, role, token, expiresAt, createdBy }) => {
  const result = await pool.query(
    `INSERT INTO hospital_invites (hospital_id, phone, email, role, token, expires_at, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, hospital_id, phone, email, role, token, status, expires_at, created_at`,
    [hospitalId, phone, email || null, role, token, expiresAt, createdBy]
  );
  return result.rows[0];
};

const findPendingInviteByToken = async (token) => {
  const result = await pool.query(
    `SELECT id, hospital_id, phone, email, role, token, status, expires_at
     FROM hospital_invites
     WHERE token = $1
       AND status = 'pending'
     LIMIT 1`,
    [token]
  );
  return result.rows[0] || null;
};

const acceptInvite = async ({ inviteId, acceptedBy }) => {
  await pool.query(
    `UPDATE hospital_invites
     SET status = 'accepted', accepted_by = $1, updated_at = NOW()
     WHERE id = $2`,
    [acceptedBy, inviteId]
  );
};

module.exports = {
  createInvite,
  findPendingInviteByToken,
  acceptInvite,
};
