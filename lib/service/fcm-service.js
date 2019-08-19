'use strict'

let _ = require('lodash')
let eh = require('./../handlers/exception-hander');
let FcmHandler = require('./../handlers/fcm-handler');

async function sendFCMMessage(clientToken, message) {
    try {
        message.token = clientToken;
        Object.keys(message.data).forEach(function( key) {
           if(typeof message.data[key] === "object")
            delete message.data[key];
           else if(typeof message.data[key] === "number")
            message.data[key] = message.data[key].toString();
          });
        let response = null; 
        try {
            response = await FcmHandler.sendMessage(message);
        }
        catch (error) {
            console.log(error);
        }
        return response;
    } catch (error) {
        throw error;
    }
}

async function sendFCMMulticast(clientTokens, message) {
    try {
        delete message['_id']
        message.offer_price = message.offer_price + '';
        message.commision_percent = message.commision_percent + '';
        message.product_price = message.product_price + '';
        let message1 = {
            data: message,
            tokens: clientTokens,
        };
        let response = null; 
        try {
              response = await FcmHandler.sendMulticast(message1);
        }
        catch (error) {
              console.log(error);
        }
        console.log(JSON.stringify(response.responses));
        
        return response;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    sendFCMMessage,
    sendFCMMulticast
}