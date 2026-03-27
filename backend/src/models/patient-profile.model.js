const { pool } = require('../config/db');

const getPatientProfileByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, date_of_birth, gender, blood_group, emergency_contact_name,
            emergency_contact_phone, allergies, chronic_conditions, created_at, updated_at
     FROM patient_profiles
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
};

const upsertPatientProfile = async ({
  userId,
  dateOfBirth,
  gender,
  bloodGroup,
  emergencyContactName,
  emergencyContactPhone,
  allergies,
  chronicConditions,
}) => {
  const result = await pool.query(
    `INSERT INTO patient_profiles (
      user_id, date_of_birth, gender, blood_group, emergency_contact_name,
      emergency_contact_phone, allergies, chronic_conditions
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (user_id)
    DO UPDATE SET
      date_of_birth = EXCLUDED.date_of_birth,
      gender = EXCLUDED.gender,
      blood_group = EXCLUDED.blood_group,
      emergency_contact_name = EXCLUDED.emergency_contact_name,
      emergency_contact_phone = EXCLUDED.emergency_contact_phone,
      allergies = EXCLUDED.allergies,
      chronic_conditions = EXCLUDED.chronic_conditions,
      updated_at = NOW()
    RETURNING id, user_id, date_of_birth, gender, blood_group, emergency_contact_name,
              emergency_contact_phone, allergies, chronic_conditions, created_at, updated_at`,
    [
      userId,
      dateOfBirth || null,
      gender || null,
      bloodGroup || null,
      emergencyContactName || null,
      emergencyContactPhone || null,
      allergies || null,
      chronicConditions || null,
    ]
  );
  return result.rows[0];
};

module.exports = {
  getPatientProfileByUserId,
  upsertPatientProfile,
};
