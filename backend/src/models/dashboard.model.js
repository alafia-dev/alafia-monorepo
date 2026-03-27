const { pool } = require('../config/db');

const listDoctorPatients = async () => {
  const result = await pool.query(
    `SELECT
       u.id,
       CONCAT(u.first_name, ' ', u.last_name) AS name,
       CASE
         WHEN pp.date_of_birth IS NULL THEN NULL
         ELSE EXTRACT(YEAR FROM age(pp.date_of_birth))::INT
       END AS age,
       COALESCE(pp.gender, 'Unknown') AS gender,
       COALESCE(
         json_agg(
           json_build_object(
             'code', COALESCE(ir.payload->>'code', ''),
             'notes', COALESCE(ir.payload->>'notes', '')
           )
         ) FILTER (WHERE ir.id IS NOT NULL),
         '[]'::json
       ) AS diagnosis
     FROM users u
     LEFT JOIN patient_profiles pp ON pp.user_id = u.id
     LEFT JOIN integration_requests ir
       ON ir.patient_user_id = u.id
      AND ir.request_type = 'diagnosis'
     WHERE u.role = 'patient'
     GROUP BY u.id, u.first_name, u.last_name, pp.date_of_birth, pp.gender
     ORDER BY u.created_at DESC`
  );

  return result.rows;
};

const createClinicalEvent = async ({ patientId, requestedBy, requestType, payload }) => {
  const result = await pool.query(
    `INSERT INTO integration_requests (patient_user_id, request_type, status, payload, requested_by)
     VALUES ($1, $2, 'pending', $3, $4)
     RETURNING id, patient_user_id, request_type, status, payload, requested_by, created_at`,
    [patientId, requestType, payload || null, requestedBy || null]
  );

  return result.rows[0];
};

const listStaff = async () => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, role, is_active
     FROM users
     WHERE role <> 'patient'
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const listOnboarding = async () => {
  const result = await pool.query(
    `SELECT hi.id,
            COALESCE(NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''), hi.email, hi.phone) AS name,
            hi.status
     FROM hospital_invites hi
     LEFT JOIN users u ON u.phone = hi.phone
     ORDER BY hi.created_at DESC`
  );

  return result.rows;
};

const listLabOrders = async () => {
  const result = await pool.query(
    `SELECT ir.id,
            CONCAT(u.first_name, ' ', u.last_name) AS patient,
            COALESCE(ir.payload->>'test', ir.payload->>'testCode', 'Lab Test') AS test,
            ir.status
     FROM integration_requests ir
     JOIN users u ON u.id = ir.patient_user_id
     WHERE ir.request_type = 'lab_order'
     ORDER BY ir.created_at DESC`
  );

  return result.rows;
};

const updateLabOrderStatusById = async (orderId, status) => {
  const result = await pool.query(
    `UPDATE integration_requests
     SET status = $2,
         processed_at = CASE WHEN $2 = 'completed' THEN NOW() ELSE processed_at END
     WHERE id = $1
       AND request_type = 'lab_order'
     RETURNING id, status`,
    [orderId, status]
  );

  return result.rows[0] || null;
};

const submitLabResultsById = async (orderId, results) => {
  const result = await pool.query(
    `UPDATE integration_requests
     SET payload = COALESCE(payload, '{}'::jsonb) || jsonb_build_object('results', $2),
         status = CASE WHEN status = 'pending' THEN 'completed' ELSE status END,
         processed_at = NOW()
     WHERE id = $1
       AND request_type = 'lab_order'
     RETURNING id, payload`,
    [orderId, results]
  );

  return result.rows[0] || null;
};

module.exports = {
  listDoctorPatients,
  createClinicalEvent,
  listStaff,
  listOnboarding,
  listLabOrders,
  updateLabOrderStatusById,
  submitLabResultsById,
};
