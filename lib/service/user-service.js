'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'users';
let Errors = require('../common/errors.js');
let _ = require('lodash');
let eh = require('./../handlers/exception-hander');
let PlanService = require('../service/plan-service.js');
let UserPlanService = require('../service/user-plan-service.js');
let ObjectId = require('mongodb').ObjectID;

async function createUser(user) {
    try {
        let response = null;
        let phoneResponse = null;
        if (user.email){
            response = await mongodb.select({
                email: user.email
            }, collection_name);
            if(response != null)
                eh.throwException(Errors.UserEmailExists,user.email);
        }
        if (user.phone){
            phoneResponse = await mongodb.select({
                phone: user.phone
            }, collection_name);
            if(phoneResponse != null)
                eh.throwException(Errors.UserPhoneNoExists,user.phone);
        }
        if (user.plan_id){
            let plan = await PlanService.getPlanById(user.plan_id);
            if(!plan)
                eh.throwException(Errors.PlanNotFound,user.plan_id);
        }
        if (response === null && phoneResponse === null) {
            let response = await mongodb.insert(user, collection_name);
            if (user.plan_id)
              response = await this.updateUserPlan(response[0]['_id'].toString(), user.plan_id)
            return response;
        } else
            eh.throwException(Errors.UserEmailExists,user.email);
    } catch (error) {
        throw error;
    }
}

async function updateUser(user_id,user) {
    try {
        let phoneResponse = null;
        let response = await this.searchUser({ id: user_id });
        if (response === null)
            eh.throwException(Errors.UserIDNotFound,user_id);
        if (response.phone != user.phone) {
            phoneResponse = await mongodb.select({
                phone: user.phone
            }, collection_name);
            if(phoneResponse != null)
                eh.throwException(Errors.UserPhoneNoExists,user.phone);
        }
        if (response.email != user.email){
            response = await mongodb.select({
                email: user.email
            }, collection_name);
            if(response != null)
                eh.throwException(Errors.UserEmailExists,user.email);
        }
        await mongodb.update({
            _id: user_id
        }, user, collection_name);

        return  await this.searchUser({ id: user_id });

    } catch (error) {
        throw error;
    }
}

async function searchUsers(query) {
    try {
        let response = null;
        response = await mongodb.selectAll(query, collection_name);
        return response;
    } catch (error) {
        throw error;
    }
}

async function searchUser(query) {
    try {
        let response = null;
        if (query.email)
            response = await mongodb.select({
                email: query.email
            }, collection_name);
        else if (query.phone)
            response = await mongodb.select({
                phone: query.phone
            }, collection_name);
        else if (query.id)
            response = await mongodb.select({
                _id: query.id
            }, collection_name);
        if (response == null){
            if(query.email)
                eh.throwException(Errors.UserNotFound,query.email);
            else if(query.phone)
                eh.throwException(Errors.UserNotFound,query.phone);
            else if (query.id)
                eh.throwException(Errors.UserIDNotFound,query.id);
        }
        if(response.plan_id){
            response.user_plan = await UserPlanService.getCurrentUserPlan(response['_id']+ '');
            if (response.user_plan){
                response.user_plan.is_expired = false;
                let planId = response.user_plan['plan_id'];
                let currentPlan = await PlanService.getPlanById(planId);
                let plans = await PlanService.getPlans();
                let allowedPlans = [];
                let planRating = currentPlan.rating;
                let userHasPlanPromises = [];
                // _.forEach(plans, function(plan){
                //         userHasPlanPromises.push( UserPlanService.hasPlan(response['_id'].toString(),plan['_id']));
                // });
                // let userHasPlans = await Promise.all(userHasPlanPromises);
                let cnt = 0;
                _.forEach(plans, function(plan){
                    try{
                        if(plan.is_one_time_plan === true)
                            plan.is_one_time_plan === true;
                        else if(plan.rating > planRating)
                            allowedPlans.push(plan);
                        else if(response.user_plan.allowed_acceptances <= response.user_plan.requests_accepted || response.user_plan.allowed_requests <= response.user_plan.requests_raised)
                            allowedPlans.push(plan);
                        cnt = cnt+1;
                        }
                    catch(ex){
                        console.log(ex);
                    }
                });
                response.upgradable_plans = allowedPlans;
                delete response.user_plan['_id'];
                delete response.user_plan['user_id'];
                delete response.user_plan['plan_id'];
                delete response.user_plan['is_active'];
            }
        }
        return response;
    } catch (error) {
        throw error;
    }
}

async function getUserById(user_id) {
    try {
        return await this.searchUser({id:user_id});;
    } catch (error) {
        throw error;
    }
}

function objectify(n) {
    return ObjectId(n);
  }

async function getUsersByIds(user_ids) {
    try {
        user_ids = _.map(user_ids,objectify);
        return await this.searchUsers({_id :{"$in" : user_ids}});;
    } catch (error) {
        throw error;
    }
}


async function updateUserPlan(user_id, plan_id) {
    try {
        let userPlan = null;
        let plan = await PlanService.getPlanById(plan_id);
        if ((await this.searchUser({ id: user_id })) === null)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else if (plan  === null)
            eh.throwException(Errors.PlanNotFound,plan_id);
        else if (plan.is_one_time_plan && (await UserPlanService.hasPlan(user_id,ObjectId(plan_id))) === true)
            eh.throwException(Errors.OneTimePlanAlreadyUsed,plan_id);
        else {
            let currentUserPlan = await UserPlanService.getCurrentUserPlan(user_id);
            let currentPlan = (currentUserPlan ? (await PlanService.getPlanById(currentUserPlan.plan_id)): null)

            if(currentPlan  && (currentPlan.rating > plan.rating || currentPlan.rating === plan.rating) && (currentUserPlan.allowed_acceptances < currentUserPlan.requests_accepted) && (currentUserPlan.allowed_requests < currentUserPlan.requests_raised) )
                eh.throwException(Errors.PlanDowngradeNotAllowed,plan_id);
            else
            {
                let userPlanObj = UserPlanService.createUserPlanObject(user_id,plan);
                if(currentUserPlan){
                    userPlanObj.allowed_requests = userPlanObj.allowed_requests + (currentUserPlan.allowed_requests - currentUserPlan.requests_raised);
                    userPlanObj.allowed_acceptances =  userPlanObj.allowed_acceptances + (currentUserPlan.allowed_acceptances - currentUserPlan.requests_accepted);
                }
                userPlan = await UserPlanService.createUserPlan(userPlanObj);
                if(userPlan.length && userPlan.length === 1)
                    userPlan = userPlan[0];
            }

            await mongodb.update({
                _id: user_id
            }, {plan_id}, collection_name);
            let user = await this.searchUser({id:user_id});
            user.user_plan = userPlan;
            delete user.plan;
            delete user.user_plan['_id'];
            delete user.user_plan.user_id;
            delete user.user_plan.plan_id;
            delete user.user_plan.is_active;
            return user;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    searchUser,
    updateUser,
    updateUserPlan,
    getUserById,
    getUsersByIds,
    searchUsers
}
