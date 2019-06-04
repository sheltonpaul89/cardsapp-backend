'use strict'
let mongodb = require('../db/mongo.js');
let collection_name = 'users';

async function insert(myobj) {
    return await mongodb.insert(myobj,collection_name);
}

async function find(query) {
    return await mongodb.select(query,collection_name);
}

module.exports = {
    
    select
  }
