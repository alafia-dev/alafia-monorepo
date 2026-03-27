const ApiError = require('../utils/api-error');
const { getUserSubscription, setUserTier, listEnabledFeaturesForUser } = require('../models/subscription.model');

const getSubscriptionSummary = async (userId) => {
  const subscription = await getUserSubscription(userId);
  const features = await listEnabledFeaturesForUser(userId);
  return { subscription, features };
};

const updateSubscriptionTier = async ({ userId, tierName }) => {
  const subscription = await setUserTier({ userId, tierName });
  if (!subscription) {
    throw new ApiError(404, 'Subscription tier not found');
  }
  return subscription;
};

module.exports = {
  getSubscriptionSummary,
  updateSubscriptionTier,
};
