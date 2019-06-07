'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'addresses';
let UserService = require('../service/user-service.js');
let Errors = require('../common/errors.js');
let _ = require('lodash');
let format = require('string-format');
let eh = require('./../handlers/exception-hander');


async function createAddress(user_id, address) {
    try {
        let response = null;
        response = await UserService.searchUser({
            id: user_id
        });
        if (response === null)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else {
            if (address.is_primary === true)
                await mongodb.updateAll({
                    user_id
                }, {
                    is_primary: false
                }, collection_name);
            return await mongodb.insert(address, collection_name);
        }
    } catch (error) {
        throw error;
    }
}
async function updateAddress(address_id, address) {
    try {
        let response = null;
        response = await this.getAddress(address_id);
        if (response === null) 
            eh.throwException(Errors.AddressNotFound,address_id);
        else {
            if (address.is_primary === true)
                await mongodb.updateAll({
                    user_id: address.user_id
                }, {
                    is_primary: false
                }, collection_name);
            await mongodb.update({
                _id: address_id
            }, address, collection_name);
            return await this.getAddress(address_id);
        }
    } catch (error) {
        throw error;
    }
}

async function getAddresses(user_id) {
    try {
        let response = null;
        response = await mongodb.selectAll({
            user_id: user_id
        }, collection_name);
        return response;
    } catch (error) {
        throw error;
    }
}

async function getAddress(address_id) {
    try {
        let response = null;
        response = await mongodb.select({
            _id: address_id
        }, collection_name);
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createAddress,
    getAddresses,
    updateAddress,
    getAddress
}