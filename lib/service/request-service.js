'use strict'
let mongodb = require('../db/mongo.js');
var ObjectId = require('mongodb').ObjectID;
let _ = require('lodash')
let Enums = require('../common/enums.js');
let collection_name = 'requests';
let UserService = require('./user-service.js');
let CardService = require('./card-service.js');

async function _isValidUser(user_id) {
    let response = await UserService.searchUser({id:user_id});
    return response === null ? false:true
}
async function createRequest(user_id,request) {
    let response = null;
    response = await UserService.searchUser({id:user_id});
    if(response === null)
        return { error : 'User Not Found'};
    else if(request.status != Enums.RequestStatus.Submitted)
        return { error : 'Request Can only be created in Submitted Status'};
    else if(request.servicer_user_id)
        return { error : 'servicer_user_id Cannot be provided when request creation'};
    else
        return await mongodb.insert(request,collection_name);
}

async function acceptRequest(request_id,user_id) {
    let request = null;
    request = await this.getRequest(request_id);
    if(request === null)
        return { error : 'Request Not Found'};
    if((await _isValidUser(user_id)) === false )
        return { error : 'User Not Found'};
    else if(request.status != Enums.RequestStatus.Submitted)
        return { error : 'Request Cannot be Accepted'};
    else{
        let valid_requests = await getCardRequests(user_id);
        let valid_request = _.find(valid_requests, function(request) { return request['_id'] === request._id; });
        if(valid_request === undefined)
            return { error : 'Request Cannot be Accepted'};
        valid_request.status = Enums.RequestStatus.Accepted;
        await mongodb.update({_id:request_id},valid_request,collection_name);
        return await this.getRequest(request_id);
    }
}
async function updateRequest(request_id,request) {
    let response = null;
    response = await this.getRequest(request_id);
    if(response === null)
        return { error : 'Request Not Found'};
    else if(request.status === Enums.RequestStatus.Accepted)
        return { error : 'Request Cannot be moved to Accepted Status'};
    else{
        await mongodb.update({_id:request_id},request,collection_name);
        return await this.getRequest(request_id);
    }
}

async function getRequests(user_id) {
    let response = null;
    response = await mongodb.selectAll({user_id:user_id},collection_name);    
    return response;
}

async function getRequests(user_id) {
    let response = null;
    response = await mongodb.selectAll({user_id:user_id},collection_name);    
    return response;
}

async function getRequest(request_id) {
    let response = null;
    response = await mongodb.select({_id:request_id},collection_name);    
    return response;
}

async function searchRequests(query) {
    let response = null;
    response = await mongodb.selectAll(query,collection_name);    
    return response;
}

async function getCardRequests(user_id) {
    if((await _isValidUser(user_id)) === false )
        return { error : 'User Not Found'};
    let cards = await CardService.getCards(user_id);
    let card_requests = [];
    for (const card of cards){
        let query = {
            bank : card.bank,
            card_type :card.card_type,
            card_category : card.card_category,
            status : Enums.RequestStatus.Submitted,
            user_id : {'$ne' : card.user_id} 
        };
        let temp_requests = await searchRequests(query);
        card_requests = card_requests.concat(temp_requests);
        
    };
    return card_requests;
}

module.exports = {
    createRequest,
    getRequests,
    updateRequest,
    getRequest,
    getCardRequests,
    acceptRequest
  }
