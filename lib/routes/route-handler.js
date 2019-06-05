'use strict'
let UserService = require('../service/user-service.js');
let AddressService = require('../service/address-service.js');
let CardService = require('../service/card-service.js');
let RequestService = require('../service/request-service.js');

async function createUser(request,reply) {
        return UserService.createUser(request.payload);
}

const GetUserByParam = (request,reply) => {
    return UserService.searchUser(request.query);
}

const createAddress = (request,reply) => {
    return AddressService.createAddress(request.payload.user_id,request.payload);
}

const updateAddress = (request,reply) => {
    return AddressService.updateAddress(request.params.address_id,request.payload);
}

const getAddresses = (request,reply) => {
    return AddressService.getAddresses(request.params.user_id);
}

const createCard = (request,reply) => {
    return CardService.createCard(request.payload.user_id,request.payload);
}

const updateCard = (request,reply) => {
    return CardService.updateCard(request.params.card_id,request.payload);
}

const getCards = (request,reply) => {
    return CardService.getCards(request.params.user_id);
}


const createRequest = (request,reply) => {
    return RequestService.createRequest(request.payload.user_id,request.payload);
}

const updateRequest = (request,reply) => {
    return RequestService.updateRequest(request.params.request_id,request.payload);
}

const acceptRequest = (request,reply) => {
    return RequestService.acceptRequest(request.params.request_id,request.params.user_id);
}

const getRequests = (request,reply) => {
    return RequestService.getRequests(request.params.user_id,request.query);
}

const getCardRequests = (request,reply) => {
    return RequestService.getCardRequests(request.params.user_id);
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