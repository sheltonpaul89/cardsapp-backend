const joi = require('joi'),
  _ = require('lodash');

const phoneNumberPayload = joi.object().keys({
  phone_number: joi.string().trim().regex(/^[0-9]{10}$/).required(),
});

const otpPayload = phoneNumberPayload.keys({
  otp : joi.string().trim().regex(/^[0-9]{5}$/).required(),
});

module.exports = {
  otpPayload,
  phoneNumberPayload
};
