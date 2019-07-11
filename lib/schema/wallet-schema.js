const joi = require('joi'),
  _ = require('lodash');

const WalletCreatePayload = joi.object().keys({
    user_id: joi.string().required(),
    balance: joi.number().optional(),
    currency: joi.string().valid('INR','USD').default("INR")
});

const WalletPayload = WalletCreatePayload.keys({
    Wallet_id: joi.string().guid().required()
});

const AmountPayload = joi.object({
  amount: joi.number().required(),
  currency: joi.string().valid('INR','USD').default("INR")
});

module.exports = {
  WalletCreatePayload,
  WalletPayload,
  AmountPayload
};
