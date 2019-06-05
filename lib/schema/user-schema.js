const joi = require('joi'),
  _ = require('lodash');

const EmailQueryParameter = joi.object({
    email: joi.string().email().description('The postal code to apply to the cart').required()
});

const userCreatePayload = joi.object().keys({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email:joi.string().email().required(),
    phone: joi.string().trim().regex(/^[0-9]{10}$/).required()

});

const userPayload = userCreatePayload.keys({
    user_id: joi.string().guid().required()
});

const userIdParam = joi.object({
  user_id: joi.string().required()
});

module.exports = {
  userPayload,
  userCreatePayload,
  EmailQueryParameter,
  userIdParam
};
