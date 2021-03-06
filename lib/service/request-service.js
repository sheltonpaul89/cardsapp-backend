'use strict'
let mongodb = require('../db/mongo.js');
var ObjectId = require('mongodb').ObjectID;
let _ = require('lodash')
let Enums = require('../common/enums.js');
let collection_name = 'requests';
let UserService = require('./user-service.js');
let CardService = require('./card-service.js');
let AddressService = require('./address-service.js');
let FCMService = require('./fcm-service.js');
let Errors = require('../common/errors.js');
let eh = require('./../handlers/exception-hander');
let UserPlanService = require('../service/user-plan-service.js');

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
        else if (!response.plan_id)
            eh.throwException(Errors.PlanNotFoundForUser);
        else if(response.user_plan && response.user_plan.allowed_requests <= response.user_plan.requests_raised)
            eh.throwException(Errors.ExceededNoOfRequests);
        else if (request.status != Enums.RequestStatus.Open)
            eh.throwException(Errors.CreationStatusError);
        else if (request.servicer_user_id)
            eh.throwException(Errors.CreationServicerError);
        else if (address && address.user_id != user_id)
            eh.throwException(Errors.AddressUserMismatch,request.address_id);
        else if(!address)
            eh.throwException(Errors.AddressNotFound,request.address_id);
        else{
            await UserPlanService.addRequestToUserPlan(user_id);
            let response = await mongodb.insert(request, collection_name);
            let matchedUsers = await CardService.searchCards({card:request.card});

            let user_ids = _.map(matchedUsers, 'user_id');
            let users = await UserService.getUsersByIds(user_ids);
            let client_Tokens = _.compact(_.map(users, 'client_token'));
            if(client_Tokens.length > 0) await FCMService.sendFCMMulticast(client_Tokens,response[0]);
            return response;
        }
            
    } catch (error) {
        throw error;
    }
}

async function acceptRequest(request_id, user_id) {
    try {
        let request = null;
        let response = await UserService.searchUser({
            id: user_id
        });
        request = await this.getRequest(request_id);
        if (request === null)
            eh.throwException(Errors.RequestNotFound,request_id);
        if (response === null)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else if (!response.plan_id)
            eh.throwException(Errors.PlanNotFoundForUser);
        else if(response.user_plan && response.user_plan.allowed_acceptances <= response.user_plan.requests_accepted)
            eh.throwException(Errors.ExceededNoOfAcceptances);
        else if (request.status != Enums.RequestStatus.Open)
            eh.throwException(Errors.RequestAcceptError);
        else {
            let valid_requests = await getCardRequests(user_id);
            let valid_request = _.find(valid_requests, function (request) {
                return request['_id'].toString() === request_id;
            });
            if (valid_request === undefined)
                eh.throwException(Errors.InvalidRequest);
            valid_request.status = Enums.RequestStatus.Accepted;
            valid_request.servicer_user_id = user_id;
            delete valid_request['_id'];

            let request = await this.getRequest(request_id);
            
            await UserPlanService.addAcceptanceToUserPlan(user_id);
            await mongodb.update({
                _id: request_id
            }, valid_request, collection_name);
            
            request = await this.getRequest(request_id);
            let requester = await UserService.getUserById(request.user_id);
            delete requester['_id'];
            delete requester['plan_id'];
            request.requester = _.cloneDeep(requester);
            if(request.servicer_user_id){
                let servicer = await UserService.getUserById(request.servicer_user_id);
                delete servicer['_id'];
                delete servicer['plan_id'];
                request.servicer = _.cloneDeep(servicer);
            }
            // Send FCM Notification for the requester
            let fcmMessage = {data : _.cloneDeep(request)};
            fcmMessage.data.message = 'Request is Accepted by a servicer'
            fcmMessage.data.id = fcmMessage.data['_id'].toString();
            delete fcmMessage.data['_id'];
            let raiser = await UserService.searchUser({id: request.user_id});
            if(raiser.client_token) await FCMService.sendFCMMessage(raiser.client_token,fcmMessage);

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
        else if(response.status === Enums.RequestStatus.Open && request.status === Enums.RequestStatus.Open){
            await mongodb.update({
                _id: request_id
            }, request, collection_name);
            
            request = await this.getRequest(request_id);
            let requester = await UserService.getUserById(request.user_id);
            delete requester['_id'];
            delete requester['plan_id'];
            request.requester = _.cloneDeep(requester);
            if(request.servicer_user_id){
                let servicer = await UserService.getUserById(request.servicer_user_id);
                delete servicer['_id'];
                delete servicer['plan_id'];
                request.servicer = _.cloneDeep(servicer);
            }
            return request;
        }
        else
            eh.throwException(Errors.StatusUpdateError);
    } catch (error) {
        throw error;
    }
}

async function updateRequestStatus(request_id, request) {
    try {
        let response = null;
        response = await this.getRequest(request_id);
        if (response === null)
            eh.throwException(Errors.RequestNotFound,request_id);
        else if (request.status === Enums.RequestStatus.Accepted || request.status === Enums.RequestStatus.Open)
            eh.throwException(Errors.AllowedStatusUpdateError);
        else if((response.status === Enums.RequestStatus.Accepted && request.status === Enums.RequestStatus.Purchased) || 
            (response.status === Enums.RequestStatus.Purchased && request.status === Enums.RequestStatus.Closed) ||
            request.status === Enums.RequestStatus.Cancelled){
            response.status = request.status
            await mongodb.update({
                _id: request_id
            }, request, collection_name);
            
            request = await this.getRequest(request_id);
            let requester = await UserService.getUserById(request.user_id);
            delete requester['_id'];
            delete requester['plan_id'];
            request.requester = _.cloneDeep(requester);
            if(request.servicer_user_id){
                let servicer = await UserService.getUserById(request.servicer_user_id);
                delete servicer['_id'];
                delete servicer['plan_id'];
                request.servicer = _.cloneDeep(servicer);
            }

            // Send FCM Notification for the requester and servicer
            let fcmMessage = {data : _.cloneDeep(request)};
            fcmMessage.data.message = 'Request Status moved to '+request.status;
            fcmMessage.data.id = fcmMessage.data['_id'].toString();
            delete fcmMessage.data['_id'];
            let raiser = await UserService.searchUser({id: request.user_id});
            if(raiser.client_token) await FCMService.sendFCMMessage(raiser.client_token,fcmMessage);
            if(request.servicer.client_token) await FCMService.sendFCMMessage(request.servicer.client_token,fcmMessage);

            return request;
        }
        else
            eh.throwException(Errors.InvalidStateTransitionError);
    } catch (error) {
        throw error;
    }
}

async function updatePaymentTransaction(request_id, payload) {
    try {
        let response = null;
        response = await this.getRequest(request_id);
        if (response === null)
            eh.throwException(Errors.RequestNotFound,request_id);
        else if ((response.status === Enums.RequestStatus.Purchased || response.status === Enums.RequestStatus.Closed ||  response.status === Enums.RequestStatus.Accepted)===false)
            eh.throwException(Errors.TransactionIdUpdateError);
        else {
            response.payment_transaction_id = payload.transaction_id;
            await mongodb.update({
                _id: request_id
            }, response, collection_name);
            
            let request = await this.getRequest(request_id);
            let requester = await UserService.getUserById(request.user_id);
            delete requester['_id'];
            delete requester['plan_id'];
            request.requester = _.cloneDeep(requester);
            if(request.servicer_user_id){
                let servicer = await UserService.getUserById(request.servicer_user_id);
                delete servicer['_id'];
                delete servicer['plan_id'];
                request.servicer = _.cloneDeep(servicer);
            }
        
            // Send FCM Notification for the servicer
            let fcmMessage = {data : _.cloneDeep(request)};
            fcmMessage.data.message = 'Payment Transaction is updated by the Requester';
            fcmMessage.data.id = fcmMessage.data['_id'].toString();
            delete fcmMessage.data['_id'];
            if(request.servicer.client_token) await FCMService.sendFCMMessage(request.servicer.client_token,fcmMessage);
            return request;
        }
    } catch (error) {
        throw error;
    }
}

async function updateServicerAccountDetails(request_id, payload) {
    try {
        let response = null;
        response = await this.getRequest(request_id);
        if (response === null)
            eh.throwException(Errors.RequestNotFound,request_id);
        else if ((response.status === Enums.RequestStatus.Purchased || response.status === Enums.RequestStatus.Closed ||  response.status === Enums.RequestStatus.Accepted)===false)
            eh.throwException(Errors.ServicerAccountUpdateError);
        else {
            response.servicer_bank_account = payload;
            await mongodb.update({
                _id: request_id
            }, response, collection_name);
            
            let request = await this.getRequest(request_id);
            let requester = await UserService.getUserById(request.user_id);
            delete requester['_id'];
            delete requester['plan_id'];
            request.requester = _.cloneDeep(requester);
            if(request.servicer_user_id){
                let servicer = await UserService.getUserById(request.servicer_user_id);
                delete servicer['_id'];
                delete servicer['plan_id'];
                request.servicer = _.cloneDeep(servicer);
            }
           
            // Send FCM Notification for the servicer
            let fcmMessage = {data : _.cloneDeep(request)};
            fcmMessage.data.message = 'The Servicer has updated his bank details';
            fcmMessage.data.id = fcmMessage.data['_id'].toString();
            delete fcmMessage.data['_id'];
            let raiser = await UserService.searchUser({id: request.user_id});
            if(raiser.client_token) await FCMService.sendFCMMessage(raiser.client_token,fcmMessage);
           
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
        let limit = _.get(queryParams, "limit", null)
        if (get_all === true)
            response = await mongodb.selectAll({
                servicer_user_id: user_id
            }, collection_name,true);
        response = response.concat(await mongodb.selectAll({
            user_id: user_id
        }, collection_name,true));

        if(response && response.length > 0)
        {
            for(i=0;i<response.length;i++){
                let request = response[i];
                let requester = await UserService.getUserById(request.user_id);
                delete requester['_id'];
                delete requester['plan_id'];
                request.requester = _.cloneDeep(requester);
                if(request.servicer_user_id){
                    let servicer = await UserService.getUserById(request.servicer_user_id);
                    delete servicer['_id'];
                    delete servicer['plan_id'];
                    request.servicer = _.cloneDeep(servicer);
                }
            }
            if(limit != null)
            {
                response = _.sortBy( response, 'created_date' ).reverse();
                response = _.take(response,limit);
                mongodb.deleteDates(response,false)
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
                delete requester['plan_id'];
                request.requester = _.cloneDeep(requester);
                if(request.servicer_user_id){
                    let servicer = await UserService.getUserById(request.servicer_user_id);
                    delete servicer['_id'];
                    delete servicer['plan_id'];
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
            delete requester['plan_id'];
            response.requester = _.cloneDeep(requester);
            if(response.servicer_user_id){
                let servicer = await UserService.getUserById(response.servicer_user_id);
                delete servicer['_id'];
                delete servicer['plan_id'];
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
                delete requester['plan_id'];
                request.requester = _.cloneDeep(requester);
                if(request.servicer_user_id){
                    let servicer = await UserService.getUserById(request.servicer_user_id);
                    delete servicer['_id'];
                    delete servicer['plan_id'];
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
    getAcceptedRequests,
    updatePaymentTransaction,
    updateServicerAccountDetails,
    updateRequestStatus
}