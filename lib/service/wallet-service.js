'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'wallets';
let UserService = require('../service/user-service.js');
let Errors = require('../common/errors.js');
let _ = require('lodash');
let eh = require('../handlers/exception-hander');

async function _isValidUser(user_id) {
    try {
        let response = await UserService.searchUser({
            id: user_id
        });
        return response === null ? false : true
    } catch (error) {
        throw error;
    }
}

async function createWallet(user_id,request) {
    try {
        request = request || {user_id,balance:0,currency:'INR'};
        let wallet = await getWallet(user_id);
        if ((await _isValidUser(user_id)) === false)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else if(wallet != null)
            return wallet;
        else
            return await mongodb.insert(request, collection_name);
    } catch (error) {
        throw error;
    }
}

async function putFund(user_id, amount) {
    try {
        let response = await UserService.searchUser({
            id: user_id
        });
        let wallet = await this.getWallet(user_id);
        if (response === null)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else if(wallet === null)
            wallet = await this.createWallet(user_id);
        wallet.balance = wallet.balance + amount;
        await mongodb.update({
            user_id
        },wallet , collection_name);
        return await this.getWallet(user_id);
    } catch (error) {
        throw error;
    }
}

async function redeem(user_id, amount) {
    try {
        let response = await UserService.searchUser({
            id: user_id
        });
        let wallet = await this.getWallet(user_id);
        if (response === null)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else if(wallet === null)
            wallet = await this.createWallet(user_id);
        
        if(wallet.balance < amount)
            eh.throwException(Errors.NotEnoughFunds,wallet.balance);
        wallet.balance = wallet.balance - amount;
        await mongodb.update({
            user_id
        },wallet , collection_name);
        return await this.getWallet(user_id);
    } catch (error) {
        throw error;
    }
}

async function getWallet(user_id) {
    try {
        let response = null;
        response = await mongodb.select({
            user_id
        }, collection_name);
        return response;
    } catch (error) {
        throw error;
    }
}

async function getOrCreateWallet(user_id) {
    try {
        let response = null;
        response = await mongodb.select({
            user_id
        }, collection_name);
        if(response === null)
            response = await createWallet(user_id);
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createWallet,
    getWallet,
    getOrCreateWallet,
    redeem,
    putFund
}