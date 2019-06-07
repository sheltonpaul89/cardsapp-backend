'use strict'
let UserService = require('../service/user-service.js');
let AddressService = require('../service/address-service.js');
let CardService = require('../service/card-service.js');
let RequestService = require('../service/request-service.js');
let ExceptionHandler = require('./exception-hander');
let Boom = require('boom');

async function createUser(request, reply) {
    try {
        return await UserService.createUser(request.payload);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function GetUserByParam(request, reply) {
    try {
        return await UserService.searchUser(request.query);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  createAddress(request, reply) {
    try {
        return await AddressService.createAddress(request.payload.user_id, request.payload);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  updateAddress(request, reply) {
    try {
        return await AddressService.updateAddress(request.params.address_id, request.payload);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  getAddresses(request, reply) {
    try {
        return await AddressService.getAddresses(request.params.user_id);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  createCard(request, reply) {
    try {
        return await CardService.createCard(request.payload.user_id, request.payload);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  updateCard(request, reply) {
    try {
        return await CardService.updateCard(request.params.card_id, request.payload);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }

}

async function  getCards(request, reply) {
    try {
        return await CardService.getCards(request.params.user_id);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}


async function  createRequest(request, reply) {
    try {
        return await RequestService.createRequest(request.payload.user_id, request.payload);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  updateRequest(request, reply) {
    try {
        return await RequestService.updateRequest(request.params.request_id, request.payload);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }

}

async function  acceptRequest(request, reply) {
    try {
        return await RequestService.acceptRequest(request.params.request_id, request.params.user_id);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  getRequests(request, reply) {
    try {
        return await RequestService.getRequests(request.params.user_id, request.query);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  getCardRequests(request, reply) {
    try {
        return await RequestService.getCardRequests(request.params.user_id);
    } catch (error) {
        console.error(error);
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}




module.exports = {
    createUser,
    GetUserByParam,
    createAddress,
    getAddresses,
    updateAddress,
    createCard,
    getCards,
    updateCard,
    createRequest,
    updateRequest,
    getRequests,
    getCardRequests,
    acceptRequest
}