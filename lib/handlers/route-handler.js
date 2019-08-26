'use strict'
let UserService = require('../service/user-service.js');
let WalletService = require('../service/wallet-service.js');
let AddressService = require('../service/address-service.js');
let CardService = require('../service/card-service.js');
let RequestService = require('../service/request-service.js');
let PlanService = require('../service/plan-service.js');
let FcmService = require('../service/fcm-service.js');
let OTPService = require('../service/otp-service.js');
let ExceptionHandler = require('./exception-hander');
let logger = require('./log-handler').logger;

async function createUser(request, reply) {
    try {
        logger.info("Request URL :"+request.url,request.payload);
        let response = await UserService.createUser(request.payload);
        logger.info("Response",response);
        return response;
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        logger.info("Error Response",err);
        return reply.response(err).code(err.statusCode);
    }
}

async function updateUser(request, reply) {
    try {
        return await UserService.updateUser(request.params.user_id,request.payload);
    } catch (error) {
        // let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}


async function createPlan(request, reply) {
    try {
        return await PlanService.createPlan(request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function getPlans(request, reply) {
    try {
        return await PlanService.getPlans({});
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function deletePlanById(request, reply) {
    try {
        return await PlanService.deletePlanById(request.params.plan_id);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function getPlanById(request, reply) {
    try {
        return await PlanService.getPlanById(request.params.plan_id);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function GetUserByParam(request, reply) {
    try {
        return await UserService.searchUser(request.query);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function GetUserById(request, reply) {
    try {
        return await UserService.getUserById(request.params.user_id);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function GetWalletByUserId(request, reply) {
    try {
        return await WalletService.getOrCreateWallet(request.params.user_id);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function redeemWalletFund(request, reply) {
    try {
        return await WalletService.redeem(request.params.user_id,request.payload.amount);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function addWalletFund(request, reply) {
    try {
        return await WalletService.putFund(request.params.user_id,request.payload.amount);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

addWalletFund

async function updateUserPlan(request, reply) {
    try {
        return await UserService.updateUserPlan(request.params.user_id,request.payload.plan_id);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  createAddress(request, reply) {
    try {
        return await AddressService.createAddress(request.payload.user_id, request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  updateAddress(request, reply) {
    try {
        return await AddressService.updateAddress(request.params.address_id, request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  getAddresses(request, reply) {
    try {
        return await AddressService.getAddresses(request.params.user_id);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  createCard(request, reply) {
    try {
        return await CardService.createCard(request.payload.user_id, request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  updateCard(request, reply) {
    try {
        return await CardService.updateCard(request.params.card_id, request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }

}

async function  getCards(request, reply) {
    try {
        return await CardService.getCards(request.params.user_id);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}


async function  createRequest(request, reply) {
    try {
        return await RequestService.createRequest(request.payload.user_id, request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  updateRequest(request, reply) {
    try {
        return await RequestService.updateRequest(request.params.request_id, request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  updateRequestStatus(request, reply) {
    try {
        return await RequestService.updateRequestStatus(request.params.request_id, request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  updatePaymentTransaction(request, reply) {
    try {
        return await RequestService.updatePaymentTransaction(request.params.request_id, request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  updateServicerAccountDetails(request, reply) {
    try {
        return await RequestService.updateServicerAccountDetails(request.params.request_id, request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}


async function  acceptRequest(request, reply) {
    try {
        return await RequestService.acceptRequest(request.params.request_id, request.params.user_id);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  sendFCMMessage(request, reply) {
    try {
        return await FcmService.sendFCMMessage(request.headers['client-token'], request.payload);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function sendOTP(request, reply) {
    try {
        return await OTPService.sendOTP(request.payload.phone_number);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function verifyOTP(request, reply) {
    try {
        return await OTPService.verifyOTP(request.payload.phone_number,request.payload.otp);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  getRequests(request, reply) {
    try {
        return await RequestService.getRequests(request.params.user_id, request.query);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  getAcceptedRequests(request, reply) {
    try {
        return await RequestService.getAcceptedRequests(request.params.user_id, request.query);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}

async function  getCardRequests(request, reply) {
    try {
        return await RequestService.getCardRequests(request.params.user_id);
    } catch (error) {
        let err = ExceptionHandler.processException(error);
        return reply.response(err).code(err.statusCode);
    }
}




module.exports = {
    createUser,
    updateUser,
    GetUserByParam,
    createAddress,
    getAddresses,
    updateAddress,
    createCard,
    getCards,
    updateCard,
    createRequest,
    updateRequest,
    getRequests,
    getAcceptedRequests,
    getCardRequests,
    acceptRequest,
    createPlan,
    getPlans,
    getPlanById,
    deletePlanById,
    updateUserPlan,
    updateRequestStatus,
    GetUserById,
    addWalletFund,
    GetWalletByUserId,
    redeemWalletFund,
    updatePaymentTransaction,
    updateServicerAccountDetails,
    sendFCMMessage,
    sendOTP,
    verifyOTP
}