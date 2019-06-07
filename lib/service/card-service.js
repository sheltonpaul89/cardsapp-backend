'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'cards';
let UserService = require('./user-service.js');
let Errors = require('../common/errors.js');
let _ = require('lodash');
let format = require('string-format');
let eh = require('./../handlers/exception-hander');


async function createCard(user_id, card) {
    try {
        let response = null;
        response = await UserService.searchUser({
            id: user_id
        });
        if (response === null)
            eh.throwException(Errors.UserIDNotFound,user_id);
        else
            return await mongodb.insert(card, collection_name);
    } catch (error) {
        throw error;
    }
}

async function updateCard(card_id, card) {
    try {
        let response = null;
        response = await this.getCard(card_id);
        if (response === null)
            eh.throwException(Errors.CardIDNotFound,card_id);
        else {
            if (card.is_primary === true)
                await mongodb.updateAll({
                    user_id: card.user_id
                }, {
                    is_primary: false
                }, collection_name);
            await mongodb.update({
                _id: card_id
            }, card, collection_name);
            return await this.getCard(card_id);
        }
    } catch (error) {
        throw error;
    }
}

async function getCards(user_id) {
    try {
        let response = null;
        response = await mongodb.selectAll({
            user_id: user_id
        }, collection_name);
        return response;
    } catch (error) {
        throw error;
    }
}

async function searchCards(query) {
    try {
        let response = null;
        response = await mongodb.selectAll(query, collection_name);
        return response;
    } catch (error) {
        throw error;
    }
}

async function getCard(card_id) {
    try {
        let response = null;
        response = await mongodb.select({
            _id: card_id
        }, collection_name);
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createCard,
    getCards,
    updateCard,
    getCard,
    searchCards
}