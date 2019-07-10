'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'users';
let Errors = require('../common/errors.js');
let _ = require('lodash');
let eh = require('./../handlers/exception-hander');
let PlanService = require('../service/plan-service.js');

async function createUser(user) {
    try {
        let response = null;
        if (user.email)
            response = await mongodb.select({
                email: user.email
            }, collection_name);
        if (response === null) {
            let response = await mongodb.insert(user, collection_name);
            return response;
        } else
            eh.throwException(Errors.UserEmailExists,user.email);
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
        else if (query.id)
            response = await mongodb.select({
                _id: query.id
            }, collection_name);
        if (response == null){
            if(query.email)
                eh.throwException(Errors.UserNotFound,query.email);
            else if (query.id)
                eh.throwException(Errors.UserIDNotFound,query.id);
        }
        if(response.plan_id)
            response.plan = await PlanService.getPlanById(response.plan_id);
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


async function updateUserPlan(user_id, plan_id) {
    try {
        if ((await this.searchUser({ id: user_id })) === null)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else if ( (await PlanService.getPlanById(plan_id)) === null)
            eh.throwException(Errors.PlanNotFound,plan_id);
        else {
            await mongodb.update({
                _id: user_id
            }, {plan_id}, collection_name);
            return await this.searchUser({id:user_id});
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    searchUser,
    updateUserPlan,
    getUserById
}