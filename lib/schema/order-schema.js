const joi = require('joi'),
  _ = require('lodash');
const UserSchema = require('./user-schema.js');
const RequestStatus = require('./../common/enums').RequestStatus;
let statuses = Object.keys(RequestStatus);

const RequestCreatePayload = joi.object().keys({
    card_category: joi.string().optional(),
    bank: joi.string().required(),
    card_type: joi.string().valid('credit','debit').required(),
    user_id: joi.string().required(),
    servicer_user_id: joi.string().optional(),
    ecom_url:joi.string().optional(),
    product_price: joi.number().optional(),
    currency: joi.string().valid('INR','USD').default("INR"),
    status: joi.string().valid(statuses).required(),
});

const RequestPayload = RequestCreatePayload.keys({
    request_id: joi.string().guid().required()
});

const RequestIdParam = joi.object({
  request_id: joi.string().required()
});

const UserRequestIdParam = UserSchema.userIdParam.keys({
  request_id: joi.string().required()
});





module.exports = {
  RequestCreatePayload,
  RequestPayload,
  RequestIdParam,
  UserRequestIdParam
};
