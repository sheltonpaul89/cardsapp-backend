'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'cards';
let UserService = require('./user-service.js');

async function createCard(user_id,card) {
    let response = null;
    response = await UserService.searchUser({id:user_id});
    if(response === null)
        return { error : 'User Not Found'};
    else
        return await mongodb.insert(card,collection_name);
}

async function updateCard(card_id,card) {
    let response = null;
    response = await this.getCard(card_id);
    if(response === null)
        return { error : 'Card Not Found'};
    else{
        if(card.is_primary === true)
            await mongodb.updateAll({user_id:card.user_id},{is_primary:false},collection_name);
        await mongodb.update({_id:card_id},card,collection_name);
        return await this.getCard(card_id);
    }
}

async function getCards(user_id) {
    let response = null;
    response = await mongodb.selectAll({user_id:user_id},collection_name);    
    return response;
}

async function searchCards(query) {
    let response = null;
    response = await mongodb.selectAll(query,collection_name);    
    return response;
}

async function getCard(card_id) {
    let response = null;
    response = await mongodb.select({_id:card_id},collection_name);    
    return response;
}

module.exports = {
    createCard,
    getCards,
    updateCard,
    getCard,
    searchCards
  }
