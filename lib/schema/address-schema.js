const joi = require('joi'),
  _ = require('lodash');

const AddressCreatePayload = joi.object().keys({
    line1: joi.string().required(),
    line2: joi.string().optional(),
    city: joi.string().required(),
    state: joi.string().required(),
    user_id: joi.string().required(),
    is_primary: joi.boolean().optional(),
});

const AddressPayload = AddressCreatePayload.keys({
    address_id: joi.string().guid().required()
});

const AddressIdParam = joi.object({
  address_id: joi.string().required()
});




module.exports = {
  AddressCreatePayload,
  AddressPayload,
  AddressIdParam
};
