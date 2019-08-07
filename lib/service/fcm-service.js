'use strict'

let _ = require('lodash')
let eh = require('./../handlers/exception-hander');
let FcmHandler = require('./../handlers/fcm-handler');

async function sendFCMMessage(clientToken, message) {
    try {
        message.token = clientToken;
        let response = FcmHandler.sendMessage(message);
        return response;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    sendFCMMessage
}