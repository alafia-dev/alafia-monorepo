const crypto = require('crypto');

const ApiError = require('../utils/api-error');
const { createHospital, findHospitalById, addMembership, listHospitalMembers } = require('../models/hospital.model');
const { createInvite, findPendingInviteByToken, acceptInvite } = require('../models/invite.model');
const { findUserByPhone } = require('../models/user.model');
const { sendHospitalInviteEmail } = require('./email.service');

const createHospitalWithAdminMembership = async ({ name, code, address, actorUserId }) => {
  const hospital = await createHospital({ name, code, address, createdBy: actorUserId });
  await addMembership({ hospitalId: hospital.id, userId: actorUserId, role: 'admin', invitedBy: actorUserId });
  return hospital;
};

const inviteHospitalMember = async ({ hospitalId, phone, email, role, actorUserId }) => {
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
  const hospital = await findHospitalById(hospitalId);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  const invite = await createInvite({ hospitalId, phone, email, role, token, expiresAt, createdBy: actorUserId });
  const onboardingUrl = `${process.env.APP_BASE_URL || 'http://localhost:5000'}/api/hospitals/invites/${token}/accept`;

  let emailDelivery = null;
  if (email) {
    emailDelivery = await sendHospitalInviteEmail({
      to: email,
      hospitalName: hospital.name,
      role,
      onboardingUrl,
      expiresAt,
    });
  }

  return {
    invite,
    onboardingUrl,
    emailDelivery,
  };
};

const acceptHospitalInviteByToken = async ({ token, actorUserId = null }) => {
  const invite = await findPendingInviteByToken(token);
  if (!invite) {
    throw new ApiError(404, 'Invite not found or not pending');
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    throw new ApiError(410, 'Invite expired');
  }

  const user = await findUserByPhone(invite.phone);
  if (!user) {
    throw new ApiError(404, 'No user found for this invite phone. Register first.');
  }

  await addMembership({ hospitalId: invite.hospital_id, userId: user.id, role: invite.role, invitedBy: actorUserId });
  await acceptInvite({ inviteId: invite.id, acceptedBy: user.id });

  return { hospitalId: invite.hospital_id, role: invite.role, userId: user.id };
};

const getHospitalMembers = (hospitalId) => listHospitalMembers(hospitalId);

module.exports = {
  createHospitalWithAdminMembership,
  inviteHospitalMember,
  acceptHospitalInviteByToken,
  getHospitalMembers,
};
