const ApiError = require('../utils/api-error');
const { getDidWalletByUserId, upsertDidWallet } = require('../models/did-wallet.model');
const { createAuditLog } = require('../models/audit.model');

const getDidWalletForUser = (userId) => getDidWalletByUserId(userId);

const connectDidWalletForUser = async ({ userId, did, walletProvider }) => {
  if (!did) {
    throw new ApiError(400, 'did is required');
  }

  const wallet = await upsertDidWallet({ userId, did, walletProvider });

  await createAuditLog({
    actorUserId: userId,
    action: 'did_wallet.connected',
    entityType: 'did_wallet',
    entityId: wallet.id,
    metadata: { did, walletProvider: walletProvider || null },
  });

  return wallet;
};

module.exports = {
  getDidWalletForUser,
  connectDidWalletForUser,
};
