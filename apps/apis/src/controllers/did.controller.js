const asyncHandler = require('../utils/async-handler');
const didService = require('../services/did.service');

const getMyDidWallet = asyncHandler(async (req, res) => {
  const wallet = await didService.getDidWalletForUser(req.auth.sub);
  res.status(200).json({ ok: true, wallet });
});

const connectDidWallet = asyncHandler(async (req, res) => {
  const wallet = await didService.connectDidWalletForUser({ userId: req.auth.sub, ...req.validatedBody });

  res.status(200).json({ ok: true, wallet });
});

module.exports = {
  getMyDidWallet,
  connectDidWallet,
};
