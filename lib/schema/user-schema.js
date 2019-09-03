const joi = require('joi'),
  _ = require('lodash');

const EmailQueryParameter = joi.object({
    email: joi.string().email().description('email address of the user').optional(),
    phone: joi.string().trim().regex(/^[0-9]{10}$/).optional()
});

const userCreatePayload = joi.object().keys({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email:joi.string().email().required(),
    phone: joi.string().trim().regex(/^[0-9]{10}$/).required(),
    plan_id:joi.string().optional(),
    client_token:joi.string().required(),

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
