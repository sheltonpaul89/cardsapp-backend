'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'userplans';
let Errors = require('../common/errors.js');
let _ = require('lodash');
let eh = require('../handlers/exception-hander');

async function createUserPlan(userPlan) {
    try {
        await mongodb.updateAll({
            user_id: userPlan.user_id
        }, {
            is_active: false
        }, collection_name);
        let response = await mongodb.insert(userPlan, collection_name);
        return response; 
    } catch (error) {
        throw error;
    }
}


async function getCurrentUserPlan(user_id) {
    try {
        let response = null;
        let query = {user_id , is_active : true, expires_at: { $gte: new Date() }};
        response = await mongodb.selectAll( query, collection_name);
        if(response.length > 1)
            eh.throwException(Errors.MoreThan1PlanActive,plan_id); 
        else if(response.length === 1 && (response[0].allowed_acceptances > response[0].requests_accepted || response[0].allowed_requests > response[0].requests_raised))
            return response[0];
        else
            return null;
    } catch (error) {
        throw error;
    }
}

async function hasPlan(user_id,plan_id) {
    try {
        let response = null;
        let query = {user_id , plan_id};
        response = await mongodb.selectAll( query, collection_name);
        if(response.length > 0) return true;
        else return false;
    } catch (error) {
        throw error;
    }
}

async function addRequestToUserPlan(user_id) {
    try {
        let userPlan = await this.getCurrentUserPlan(user_id);
        userPlan.requests_raised = userPlan.requests_raised + 1;
        await mongodb.update({
            _id: userPlan['_id']
        }, userPlan, collection_name);
        return userPlan;
    } catch (error) {
        throw error;
    }
}

function createUserPlanObject(user_id,plan) {
    try {
        let userPlan = {
            plan_id : plan['_id'],
            user_id :user_id,
            allowed_requests : plan.allowed_requests,
            allowed_acceptances : plan.allowed_requests,
            requests_raised : 0,
            requests_accepted : 0,
            expires_at : new Date(),
            is_active : true
        };
        let expires_at = null;
        if(plan.validity_in_months === 0)
            expires_at = new Date(2200,12,12);
        else
        {
            expires_at = new Date();
            expires_at.setMonth(expires_at.getMonth() + plan.validity_in_months);    
        }
        userPlan.expires_at = expires_at;
        return userPlan;
    } catch (error) {
        throw error;
    }
}

async function addAcceptanceToUserPlan(user_id) {
    try {
        let userPlan = await this.getCurrentUserPlan(user_id);
        userPlan.requests_accepted = userPlan.requests_accepted + 1;
        await mongodb.update({
            _id: userPlan['_id']
        }, userPlan, collection_name);
        return userPlan;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createUserPlan,
    getCurrentUserPlan,
    addRequestToUserPlan,
    addAcceptanceToUserPlan,
    createUserPlanObject,
    hasPlan
}