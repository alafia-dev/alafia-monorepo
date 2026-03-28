const { pool } = require('../config/db');

const createAuditLog = async ({ actorUserId = null, action, entityType, entityId = null, metadata = null }) => {
  const result = await pool.query(
    `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, actor_user_id, action, entity_type, entity_id, metadata, created_at`,
    [actorUserId, action, entityType, entityId, metadata]
  );
  return result.rows[0];
};

const listAuditLogs = async (limit = 100) => {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Number(limit), 1), 500) : 100;
  const result = await pool.query(
    `SELECT id, actor_user_id, action, entity_type, entity_id, metadata, created_at
     FROM audit_logs
     ORDER BY created_at DESC
     LIMIT $1`,
    [safeLimit]
  );
  return result.rows;
};

module.exports = {
  createAuditLog,
  listAuditLogs,
};
