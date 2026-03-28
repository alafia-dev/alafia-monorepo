const { pool } = require('../config/db');

const createUser = async ({ firstName, lastName, phone, email = null, passwordHash = null, role = 'patient' }) => {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, phone, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, first_name, last_name, phone, email, role, created_at`,
    [firstName, lastName, phone, email, passwordHash, role]
  );
  return result.rows[0];
};

const findUserByPhone = async (phone) => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, phone, email, role, is_active, created_at
     FROM users
     WHERE phone = $1
     LIMIT 1`,
    [phone]
  );
  return result.rows[0] || null;
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, phone, email, role, is_active, created_at
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email]
  );
  return result.rows[0] || null;
};

const findUserAuthByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, phone, email, password_hash, role, is_active, created_at
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email]
  );
  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, phone, email, role, is_active, created_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
};

const touchLastLogin = async (id) => {
  await pool.query('UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1', [id]);
};

const setUserPasswordHash = async (id, passwordHash) => {
  await pool.query('UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1', [id, passwordHash]);
};

module.exports = {
  createUser,
  findUserAuthByEmail,
  findUserByEmail,
  findUserByPhone,
  findUserById,
  setUserPasswordHash,
  touchLastLogin,
};
