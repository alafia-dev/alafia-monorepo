const { findUserById } = require('../models/user.model');
const { getPatientProfileByUserId, upsertPatientProfile } = require('../models/patient-profile.model');

const getPatientProfileBundle = async (userId) => {
  const user = await findUserById(userId);
  const profile = await getPatientProfileByUserId(userId);
  return { user, profile };
};

const updatePatientProfile = async (userId, payload) => upsertPatientProfile({ userId, ...payload });

module.exports = {
  getPatientProfileBundle,
  updatePatientProfile,
};
