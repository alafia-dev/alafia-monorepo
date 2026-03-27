const { pool } = require('../config/db');

const createHospital = async ({ name, code, address, createdBy }) => {
  const result = await pool.query(
    `INSERT INTO hospitals (name, code, address, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, code, address, created_at`,
    [name, code, address || null, createdBy || null]
  );
  return result.rows[0];
};

const findHospitalById = async (hospitalId) => {
  const result = await pool.query(
    `SELECT id, name, code, address, created_at
     FROM hospitals
     WHERE id = $1
     LIMIT 1`,
    [hospitalId]
  );
  return result.rows[0] || null;
};

const addMembership = async ({ hospitalId, userId, role, invitedBy = null }) => {
  const result = await pool.query(
    `INSERT INTO hospital_memberships (hospital_id, user_id, role, invited_by, joined_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (hospital_id, user_id) DO UPDATE SET role = EXCLUDED.role
     RETURNING id, hospital_id, user_id, role, joined_at`,
    [hospitalId, userId, role, invitedBy]
  );
  return result.rows[0];
};

const listHospitalMembers = async (hospitalId) => {
  const result = await pool.query(
    `SELECT hm.id, hm.role, hm.joined_at, u.id AS user_id, u.first_name, u.last_name, u.phone, u.email
     FROM hospital_memberships hm
     JOIN users u ON u.id = hm.user_id
     WHERE hm.hospital_id = $1
     ORDER BY hm.created_at ASC`,
    [hospitalId]
  );
  return result.rows;
};

module.exports = {
  createHospital,
  findHospitalById,
  addMembership,
  listHospitalMembers,
};
