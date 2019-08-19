'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'plans';
let Errors = require('../common/errors.js');
let _ = require('lodash');
let eh = require('../handlers/exception-hander');

async function createPlan(plan) {
    try {
        if (plan.allowed_acceptances < 0 || plan.allowed_requests < 0 || plan.validity_in_months < 0 || plan.plan_cost < 0)
            eh.throwException(Errors.InvalidPlanValues);
        let existing_plans = await this.getPlans({allowed_acceptances:plan.allowed_acceptances,
            allowed_requests: plan.allowed_requests,
            plan_cost: plan.plan_cost,
            validity_in_months : plan.validity_in_months,
            is_active : true
        });
        if(existing_plans.length > 0)
            eh.throwException(Errors.PlanExists);
        plan.is_active = true;
        let response = await mongodb.insert(plan, collection_name);
        return response; 

    } catch (error) {
        throw error;
    }
}

async function getPlans(query = {}) {
    try {
        let response = null;
        query.is_active = true;
        if (query.id)
        {
            let qr = {
                _id: query.id,
                is_active:true
            };
            response = await mongodb.select(qr, collection_name);
            if(response && response.length === 1)
                response = response[0];
        }
            
        else
            response = await mongodb.selectAll( query, collection_name);
        if (response == null)
            eh.throwException(Errors.NoPlansFound);
        return response;
    } catch (error) {
        throw error;
    }
}

async function getPlanById(plan_id) {
    try {
        let response = await this.getPlans({id:plan_id,is_active:true});
        if (response == null)
            eh.throwException(Errors.PlanNotFound,plan_id);
        return response;
    } catch (error) {
        throw error;
    }
}

async function deletePlanById(plan_id) {
    try {
        let response = null;
        response = await this.getPlanById(plan_id);
        if (response === null)
            eh.throwException(Errors.PlanNotFound,plan_id);
        else {
            await mongodb.update({
                _id: plan_id
            }, {is_active:false}, collection_name);
            return {status : 'Deleted'};
        }
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createPlan,
    getPlans,
    getPlanById,
    deletePlanById
}