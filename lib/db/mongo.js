'use strict'
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
// const co = require('co');
var server = 'localhost';
var port_no = 27017;
var db_name = 'Cardzapp';
var url = 'mongodb://' + server + ':' + port_no + '/';

async function insert(myobj, collection_name = 'Cardzapp') {
  let db = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  var dbo = db.db(db_name);
  let response = await dbo.collection(collection_name).insertOne(myobj);
  console.log("1 document inserted");
  db.close();
  return response.ops;
}

async function update(query, myobj, collection_name = 'Cardzapp') {
  let db = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  var newvalue = {
    $set: myobj
  };
  var dbo = db.db(db_name);
  if ('_id' in query)
    query['_id'] = new ObjectId(query['_id']);
  let response = await dbo.collection(collection_name).updateOne(query, newvalue);
  
  db.close();
  return response;
}

async function updateAll(query, myobj, collection_name = 'Cardzapp') {
  let db = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  var newvalue = {
    $set: myobj
  };
  var dbo = db.db(db_name);
  if ('_id' in query)
    query['_id'] = new ObjectId(query['_id']);
  let response = await dbo.collection(collection_name).updateMany(query, newvalue);
  db.close();
  return response;
}

async function select(query, collection_name = 'Cardzapp') {
  let db = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  var dbo = db.db(db_name);
  let resp = null;
  try {
    if ('_id' in query) {
      query = {
        _id: new ObjectId(query['_id'])
      };
      resp = dbo.collection(collection_name).findOne(query);
    } else
      resp = dbo.collection(collection_name).findOne(query);
  } catch (ex) {
    console.log(ex);
    return {
      error: true
    };
  }
  let response = await resp;
  db.close();
  return response;
}

async function selectAll(query, collection_name = 'Cardzapp') {
  let db = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  var dbo = db.db(db_name);
  let resp = dbo.collection(collection_name).find(query).toArray();
  let response = await resp;
  db.close();
  return response;
}

module.exports = {
  insert,
  select,
  selectAll,
  update,
  updateAll
}