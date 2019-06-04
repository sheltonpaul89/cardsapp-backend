'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'addresses';
let UserService = require('../service/user-service.js');

async function createAddress(user_id,address) {
    let response = null;
    response = await UserService.searchUser({id:user_id});
    if(response === null)
        return { error : 'User Not Found'};
    else{
        if(address.is_primary === true)
            await mongodb.updateAll({user_id},{is_primary:false},collection_name);
        return await mongodb.insert(address,collection_name);
    }
}

async function updateAddress(address_id,address) {
    let response = null;
    response = await this.getAddress(address_id);
    if(response === null)
        return { error : 'Address Not Found'};
    else{
        if(address.is_primary === true)
            await mongodb.updateAll({user_id:address.user_id},{is_primary:false},collection_name);
        await mongodb.update({_id:address_id},address,collection_name);
        return await this.getAddress(address_id);
    }
}

async function getAddresses(user_id) {
    let response = null;
    response = await mongodb.selectAll({user_id:user_id},collection_name);    
    return response;
}

async function getAddress(address_id) {
    let response = null;
    response = await mongodb.select({_id:address_id},collection_name);    
    return response;
}

module.exports = {
    createAddress,
    getAddresses,
    updateAddress,
    getAddress
  }
