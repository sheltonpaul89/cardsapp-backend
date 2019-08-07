const joi = require('joi'),
  _ = require('lodash');

const NotificationPayload = joi.object().keys({
  title: joi.string().required(),
  body: joi.string().required(),
});

const FCMPayload = joi.object().keys({
  notification: NotificationPayload
});

module.exports = {
  FCMPayload
};
