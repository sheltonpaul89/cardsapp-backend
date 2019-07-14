const joi = require('joi'),
  _ = require('lodash');
const RequestStatus = require('./../common/enums').RequestStatus;
let statuses = Object.keys(RequestStatus);

const GetAllParam = joi.object({
  get_all : joi.boolean().optional()
});

const PlanCreatePayload = joi.object().keys({
    name: joi.string().required(),
    allowed_acceptances: joi.number().integer().min(0).max(1000).required(),
    allowed_requests: joi.number().integer().min(0).max(1000).required(),
    validity_in_months : joi.number().integer().min(0).max(20).required(),
    plan_cost: joi.number().min(0).required(),
    currency: joi.string().valid('INR','USD').default("INR"),
    is_one_time_plan: joi.boolean().required(),
    rating: joi.number().integer().min(0).max(1000).required(),
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
