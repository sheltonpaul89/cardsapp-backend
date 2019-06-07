'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'users';
let Errors = require('../common/errors.js');
let _ = require('lodash');
let eh = require('./../handlers/exception-hander');

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
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    searchUser
}