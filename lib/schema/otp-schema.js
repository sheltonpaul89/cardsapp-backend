const joi = require('joi'),
  _ = require('lodash');


const otpInputPayload = joi.object({
    phone_number: joi.string().trim().regex(/^[0-9]{10}$/).optional(),
    email:joi.string().email().optional()
  }).min(1);

const otpPayload = otpInputPayload.keys({
  otp : joi.string().trim().regex(/^[0-9]{5}$/).required(),
});

module.exports = {
  otpPayload,
  otpInputPayload
};
