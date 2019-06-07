let Errors = require('../common/errors.js');
let _ = require('lodash');
let Constants = require('./../common/constants');
let format = require('string-format');

const processException = (error) => {
    let errorObj = _.cloneDeep(error);
    if(typeof(error)!='object' || ('stack' in error)){
        errorObj = _.cloneDeep(Errors.UnhandledException);
        // errorObj.stack = error.stack;
        errorObj.message = error.message ? error.message : Errors.UnhandledException.error;
        if(error.message){
            switch(error.message){
                case Constants.IdValueCorreptedMessage:
                    errorObj = _.cloneDeep(Errors.InValidID);
                    break;
            }
        }
    }
    return errorObj;
}

const throwException = (errorObj,value='') => {
    let error = _.cloneDeep(errorObj);
    error.message = format(error.message, value);
    throw error;
}

module.exports = {
    processException,
    throwException
}