const joi = require('joi'),
  _ = require('lodash'),
  CardBands = require('./../common/constants').CardBands;

const CardObject = joi.object({
    //Card_id: joi.string().valid(CardBands).required()
    card: joi.string().required()
  });
  
const CardCreatePayload = CardObject.keys({
    user_id: joi.string().required(),
});

const CardPayload = CardCreatePayload.keys({
    card_id: joi.string().guid().required()
});

const CardIdParam = joi.object({
  card_id: joi.string().required()
});

module.exports = {
  CardCreatePayload,
  CardPayload,
  CardIdParam,
  CardObject
};
