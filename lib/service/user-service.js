'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'users';

async function createUser(user) {
    let response = null;
    if(user.email)
        response = await mongodb.select({email:user.email},collection_name);
    if(response === null){
        let response = await mongodb.insert(user,collection_name);
        return response;
    }
    else        
        return {success : false}
}

async function searchUser(query) {
    let response = null;
    if(query.email)
        response = await mongodb.select({email:query.email},collection_name);
    else if(query.id)
        response = await mongodb.select({_id:query.id},collection_name);
    if(response == null)
        response = {status :'User Not Found'}
    return response;
}

module.exports = {
    createUser,
    searchUser
  }
