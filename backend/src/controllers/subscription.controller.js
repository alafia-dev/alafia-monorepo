const asyncHandler = require('../utils/async-handler');
const subscriptionService = require('../services/subscription.service');

const getMySubscription = asyncHandler(async (req, res) => {
  const { subscription, features } = await subscriptionService.getSubscriptionSummary(req.auth.sub);
  res.status(200).json({ ok: true, subscription, features });
});

const updateUserSubscriptionTier = asyncHandler(async (req, res) => {
  const updated = await subscriptionService.updateSubscriptionTier(req.validatedBody);

  res.status(200).json({ ok: true, subscription: updated });
});

module.exports = {
  getMySubscription,
  updateUserSubscriptionTier,
};
