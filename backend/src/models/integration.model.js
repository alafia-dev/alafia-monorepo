const { pool } = require('../config/db');

const createIntegrationRequest = async ({ patientUserId, hospitalId, requestType, payload, requestedBy }) => {
  const result = await pool.query(
    `INSERT INTO integration_requests (patient_user_id, hospital_id, request_type, payload, requested_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, patient_user_id, hospital_id, request_type, status, payload, requested_by, created_at`,
    [patientUserId, hospitalId || null, requestType, payload || null, requestedBy || null]
  );
  return result.rows[0];
};

const listIntegrationRequestsByPatient = async (patientUserId) => {
  const result = await pool.query(
    `SELECT id, patient_user_id, hospital_id, request_type, status, payload, requested_by, processed_at, created_at
     FROM integration_requests
     WHERE patient_user_id = $1
     ORDER BY created_at DESC`,
    [patientUserId]
  );
  return result.rows;
};

module.exports = {
  createIntegrationRequest,
  listIntegrationRequestsByPatient,
};
