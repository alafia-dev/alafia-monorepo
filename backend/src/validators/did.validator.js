const { z, trimmedString, optionalTrimmedString } = require('./common.validator');

const validateDidConnection = z.object({
  did: trimmedString,
  walletProvider: optionalTrimmedString,
}).strict();

module.exports = {
  validateDidConnection,
};
