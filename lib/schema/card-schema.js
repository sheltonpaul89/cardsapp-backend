const joi = require('joi'),
  _ = require('lodash');

const CardCreatePayload = joi.object().keys({
    card_category: joi.string().optional(),
    bank: joi.string().required(),
    card_type: joi.string().valid('credit','debit').required(),
    user_id: joi.string().required(),
});

const CardPayload = CardCreatePayload.keys({
    Card_id: joi.string().guid().required()
});

const CardIdParam = joi.object({
  Card_id: joi.string().required()
});




module.exports = {
  CardCreatePayload,
  CardPayload,
  CardIdParam
};
