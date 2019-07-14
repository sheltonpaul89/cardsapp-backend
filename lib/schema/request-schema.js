const joi = require('joi'),
  _ = require('lodash');
const UserSchema = require('./user-schema.js');
const CardObject = require('./card-schema.js').CardObject;
const RequestStatus = require('./../common/enums').RequestStatus;
let statuses = Object.keys(RequestStatus);

const GetAllParam = joi.object({
  get_all : joi.boolean().optional()
});

const RequestCreatePayload = CardObject.keys({
    user_id: joi.string().required(),
    address_id: joi.string().optional(),
    offer_price: joi.number().optional(),
    commision_percent: joi.number().optional(),
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

const TransactionIdParam = joi.object({
  transaction_id: joi.string().required()
});

const ServicerBankAccountPayload = joi.object({
  payment_type: joi.string().required(),
  bank: joi.string().required(),
  account_number: joi.string().optional(),
  ifsc_code: joi.string().optional(),
  upi_id : joi.string().optional()
});

module.exports = {
  RequestCreatePayload,
  RequestPayload,
  RequestIdParam,
  UserRequestIdParam,
  GetAllParam,
  TransactionIdParam,
  ServicerBankAccountPayload
};
