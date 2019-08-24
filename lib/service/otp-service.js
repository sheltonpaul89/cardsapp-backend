'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'otp';
let _ = require('lodash')
let eh = require('../handlers/exception-hander');
let ApiHandler = require('./../handlers/api-handler');
const r2 = require("r2");
let textlocalURL = _.cloneDeep(require('./../common/constants').TextLocalURL);
let Errors = require('../common/errors.js');

async function sendOTP(phone_number) {
    try {
        let otp = await getValidOTP(phone_number);
        let otp_message = 'OTP for the Phone number Authentication for Cards App is '+otp.otp;
        let url = _.cloneDeep(textlocalURL) + '&numbers='+ phone_number +'&message='+otp_message;
        let response = await ApiHandler.requestSend(url);
        if(response.errors){
            let err = _.cloneDeep( Errors.SMSSendError);
            err.message = response.errors[0].message;
            eh.throwException(err); 
        }
        return {status : 'Success'};
    } catch (error) {
        throw error;
    }
}

async function getValidOTP(phone_number){
    try {
        let response = null;
        let query = {phone_number, expires_at: { $gte: new Date() }};
        response = await mongodb.selectAll(query, collection_name);
        if (response.length > 0)
            return response[0];
        else
        {
            let otp = (Math.floor(Math.random() * 90000) + 10000)+'';
            let expires_at = new Date();
            expires_at.setMinutes(expires_at.getMinutes() + 5);    
            return (await mongodb.insert({expires_at , otp , phone_number }, collection_name))[0];
        }
    } catch (error) {
        throw error;
    }
}

async function verifyOTP(phone_number, otp) {
    try {
        let result = false;
        let query = {phone_number,otp, expires_at: { $gte: new Date() }};
        let response = await mongodb.selectAll(query, collection_name);
        if (response.length > 0)
            result = true;
        return {is_authenticated : result};
    } catch (error) {
        throw error;
    }
}


module.exports = {
    sendOTP,
    verifyOTP
}