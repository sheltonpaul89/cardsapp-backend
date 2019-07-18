'use strict'
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var _ = require('lodash');
var server = 'localhost';
var port_no = 27017;
var db_name = 'Cardzapp';
var url = 'mongodb://' + server + ':' + port_no + '/';

async function insert(myobj, collection_name = 'Cardzapp',include_dates=false) {
  let db = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  var dbo = db.db(db_name);
  myobj.created_date = new Date();
  myobj.modified_date = _.cloneDeep(myobj.created_date);
  let response = await dbo.collection(collection_name).insertOne(myobj);
  console.log("1 document inserted");
  deleteDates(response.ops,include_dates);
  db.close();
  return response.ops;
}

async function update(query, myobj, collection_name = 'Cardzapp',include_dates=false) {
  let db = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  var newvalue = {
    $set: myobj,
    $currentDate: {
      modified_date: true
    },
  };
  var dbo = db.db(db_name);
  if ('_id' in query)
    query['_id'] = new ObjectId(query['_id']);
  let response = await dbo.collection(collection_name).updateOne(query, newvalue);
  deleteDates(response,include_dates);
  db.close();
  return response;
}

async function updateAll(query, myobj, collection_name = 'Cardzapp',include_dates=false) {
  let db = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  var newvalue = {
    $set: myobj,
    $currentDate: {
      modified_date: true
    },
  };
  var dbo = db.db(db_name);
  if ('_id' in query)
    query['_id'] = new ObjectId(query['_id']);
  let response = await dbo.collection(collection_name).updateMany(query, newvalue);
  deleteDates(response,include_dates);
  db.close();
  return response;
}

async function select(query, collection_name = 'Cardzapp',include_dates=false) {
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
    console.error(ex);
    throw ex
  }
  let response = await resp;
  deleteDates(response,include_dates);
  db.close();
  return response;
}


function deleteDates(obj,include_dates){
  if(include_dates === false && obj){
    if(obj instanceof Array){
      _.forEach(obj,function(value){
        delete value.created_date;
        delete value.modified_date;  
      });
    }
    else
    {
      delete obj.created_date;
      delete obj.modified_date;
    }
  }
}

async function selectAll(query, collection_name = 'Cardzapp',include_dates=false) {
  let db = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  var dbo = db.db(db_name);
  let resp = dbo.collection(collection_name).find(query).toArray();
  let response = await resp;
  db.close();
  deleteDates(response,include_dates);
  return response;
}

module.exports = {
  insert,
  select,
  selectAll,
  update,
  updateAll,
  deleteDates
}