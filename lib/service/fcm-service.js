'use strict'

let _ = require('lodash')
let eh = require('./../handlers/exception-hander');
let FcmHandler = require('./../handlers/fcm-handler');

async function sendFCMMessage(clientToken, message) {
    try {
        message.token = clientToken;
        let response = await FcmHandler.sendMessage(message);
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
        let response = await FcmHandler.sendMulticast(message1);
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