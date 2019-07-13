'use strict'
let mongodb = require('../db/mongo.js');
var ObjectId = require('mongodb').ObjectID;
let _ = require('lodash')
let Enums = require('../common/enums.js');
let collection_name = 'requests';
let UserService = require('./user-service.js');
let CardService = require('./card-service.js');
let AddressService = require('./address-service.js');
let Errors = require('../common/errors.js');
let eh = require('./../handlers/exception-hander');


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
async function createRequest(user_id, request) {
    try {
        let address = await AddressService.getAddress(request.address_id);
        let response = await UserService.searchUser({
            id: user_id
        });
        if (response === null)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else if (request.status != Enums.RequestStatus.Open)
            eh.throwException(Errors.CreationStatusError);
        else if (request.servicer_user_id)
            eh.throwException(Errors.CreationServicerError);
        else if (address && address.user_id != user_id)
            eh.throwException(Errors.AddressUserMismatch,request.address_id);
        else if(!address)
            eh.throwException(Errors.AddressNotFound,request.address_id);
        else
            return await mongodb.insert(request, collection_name);
    } catch (error) {
        throw error;
    }
}

async function acceptRequest(request_id, user_id) {
    try {
        let request = null;
        request = await this.getRequest(request_id);
        if (request === null)
            eh.throwException(Errors.RequestNotFound,request_id);
        if ((await _isValidUser(user_id)) === false)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else if (request.status != Enums.RequestStatus.Open)
            eh.throwException(Errors.RequestAcceptError);
        else {
            let valid_requests = await getCardRequests(user_id);
            let valid_request = _.find(valid_requests, function (request) {
                return request['_id'] === request._id;
            });
            if (valid_request === undefined)
                eh.throwException(Errors.InvalidRequest);
            valid_request.status = Enums.RequestStatus.Accepted;
            valid_request.servicer_user_id = user_id;
            delete valid_request['_id'];
            await mongodb.update({
                _id: request_id
            }, valid_request, collection_name);
            
            let request = await this.getRequest(request_id);
            let requester = await UserService.getUserById(request.user_id);
            delete requester['_id'];
            request.requester = _.cloneDeep(requester);
            if(request.servicer_user_id){
                let servicer = await UserService.getUserById(request.servicer_user_id);
                delete servicer['_id'];
                request.servicer = _.cloneDeep(servicer);
            }

            return request;
        }
    } catch (error) {
        throw error;
    }
}
async function updateRequest(request_id, request) {
    try {
        let response = null;
        response = await this.getRequest(request_id);
        if (response === null)
            eh.throwException(Errors.RequestNotFound,request_id);
        else if (request.status === Enums.RequestStatus.Accepted)
            eh.throwException(Errors.AcceptedUpdateError);
        else {
            await mongodb.update({
                _id: request_id
            }, request, collection_name);
            
            let request = await this.getRequest(request_id);
            let requester = await UserService.getUserById(request.user_id);
            delete requester['_id'];
            request.requester = _.cloneDeep(requester);
            if(request.servicer_user_id){
                let servicer = await UserService.getUserById(request.servicer_user_id);
                delete servicer['_id'];
                request.servicer = _.cloneDeep(servicer);
            }

            return request;
        }
    } catch (error) {
        throw error;
    }
}

async function getRequests(user_id, queryParams = {}) {
    try {
        let response = [];
        let i =0;
        let get_all = _.get(queryParams, "get_all", null)
        if (get_all === true)
            response = await mongodb.selectAll({
                servicer_user_id: user_id
            }, collection_name);
        response = response.concat(await mongodb.selectAll({
            user_id: user_id
        }, collection_name));

        if(response && response.length > 0)
        {
            for(i=0;i<response.length;i++){
                let request = response[i];
                let requester = await UserService.getUserById(request.user_id);
                delete requester['_id'];
                request.requester = _.cloneDeep(requester);
                if(request.servicer_user_id){
                    let servicer = await UserService.getUserById(request.servicer_user_id);
                    delete servicer['_id'];
                    request.servicer = _.cloneDeep(servicer);
                }
            }
        }
        return response;
    } catch (error) {
        throw error;
    }
}

async function getAcceptedRequests(user_id, queryParams = {}) {
    try {
        let response = [];
        let i = 0;
        response = await mongodb.selectAll({
            servicer_user_id: user_id
        }, collection_name);

        if(response && response.length > 0)
        {
            for(i=0;i<response.length;i++){
                let request = response[i];
                
                let requester = await UserService.getUserById(request.user_id);
                delete requester['_id'];
                request.requester = _.cloneDeep(requester);
                if(request.servicer_user_id){
                    let servicer = await UserService.getUserById(request.servicer_user_id);
                    delete servicer['_id'];
                    request.servicer = _.cloneDeep(servicer);
                }
            }
        }

        return response;
    } catch (error) {
        throw error;
    }
}

// async function getRequests(user_id) {
//     let response = null;
//     response = await mongodb.selectAll({user_id:user_id},collection_name);    
//     return response;
// }

async function getRequest(request_id) {
    try {
        let response = null;
        response = await mongodb.select({
            _id: request_id
        }, collection_name);

        if(response != null){
            let requester = await UserService.getUserById(response.user_id);
            delete requester['_id'];
            response.requester = _.cloneDeep(requester);
            if(response.servicer_user_id){
                let servicer = await UserService.getUserById(response.servicer_user_id);
                delete servicer['_id'];
                response.servicer = _.cloneDeep(servicer);
            }
        }
        return response;
    } catch (error) {
        throw error;
    }
}

async function searchRequests(query) {
    try {
        let response = null;
        let i =0;
        response = await mongodb.selectAll(query, collection_name);

        if(response && response.length > 0)
        {
            for(i=0;i<response.length;i++){
                let request = response[i];
                
                let requester = await UserService.getUserById(request.user_id);
                delete requester['_id'];
                request.requester = _.cloneDeep(requester);
                if(request.servicer_user_id){
                    let servicer = await UserService.getUserById(request.servicer_user_id);
                    delete servicer['_id'];
                    request.servicer = _.cloneDeep(servicer);
                }
            }
        }

        return response;
    } catch (error) {
        throw error;
    }
}

async function getCardRequests(user_id) {
    try {
        if ((await _isValidUser(user_id)) === false)
            eh.throwException(Errors.UserIDNotFound,user_id)
        let cards = await CardService.getCards(user_id);
        let card_requests = [];
        for (const card of cards) {
            let query = {
                card: card.card,
                status: Enums.RequestStatus.Open,
                user_id: {
                    '$ne': card.user_id
                }
            };
            let temp_requests = await searchRequests(query);
            card_requests = card_requests.concat(temp_requests);

        };
        return card_requests;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createRequest,
    getRequests,
    updateRequest,
    getRequest,
    getCardRequests,
    acceptRequest,
    getAcceptedRequests
}