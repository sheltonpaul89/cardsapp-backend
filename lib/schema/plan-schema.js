const joi = require('joi'),
  _ = require('lodash');
const RequestStatus = require('./../common/enums').RequestStatus;
let statuses = Object.keys(RequestStatus);

const GetAllParam = joi.object({
  get_all : joi.boolean().optional()
});

const PlanCreatePayload = joi.object().keys({
    name: joi.string().required(),
    recurrence_duration: joi.number().integer().min(1).max(12).required(),
    allowed_requests: joi.number().integer().min(1).max(100).required(),
    plan_cost: joi.number().min(1).required(),
    currency: joi.string().valid('INR','USD').default("INR"),
    is_active: joi.boolean().optional(),
});

const PlanPayload = PlanCreatePayload.keys({
    plan_id: joi.string().guid().required()
});

const PlanIdParam = joi.object({
  plan_id: joi.string().required()
});



module.exports = {
  PlanCreatePayload,
  PlanPayload,
  PlanIdParam,
  GetAllParam
};
