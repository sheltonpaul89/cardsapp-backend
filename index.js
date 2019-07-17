'use strict';

const Hapi = require('@hapi/hapi');
const UserSchema = require('./lib/schema/user-schema.js');
const PlanSchema = require('./lib/schema/plan-schema.js');
const AddressSchema = require('./lib/schema/address-schema.js');
const CardSchema = require('./lib/schema/card-schema.js');
const RequestSchema = require('./lib/schema/request-schema.js');
const WalletSchema = require('./lib/schema/wallet-schema.js');

const RouteHandler = require('./lib/handlers/route-handler.js');
const version = '/v1';
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
let nconf = require('nconf');
let CardBands = require('./lib/common/constants').CardBands;


nconf.argv().env();
  if (nconf.get('config')) {
    let overrides = require(nconf.get('config'));
    nconf.overrides(overrides);
  }
  nconf.defaults(require('./configs/local'));
  let config = nconf.get();

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    const swaggerOptions = {
        info: {
                title: 'CardsApp API Documentation',
                version: Pack.version,
            },  
            grouping:'tags',
            cors: true,
            host: config.swagger_host
        };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    server.route({
        method: 'POST',
        path: version + '/plans/',
        config: {
            description: 'Create Plan ',
            notes: 'Create a New Plan in the system with the Correct Values',
            tags: ['api','plan'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: PlanSchema.PlanCreatePayload
            },
            handler: (request, h) => RouteHandler.createPlan(request, h)
        }
    });

    server.route({
        method: 'GET',
        path: version + '/plans',
        config: {
            description: 'Get All Plans',
            notes: 'Get all the active Plans in the System',
            tags: ['api','plan'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            handler: (request, h) => RouteHandler.getPlans(request, h)
        }
    });

    server.route({
        method: 'GET',
        path: version + '/plans/{plan_id}/',
        config: {
            description: 'Get Plan by Plan ID',
            notes: 'Get all the Plans for the Plan ID',
            tags: ['api','plan'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            validate: {
                params: PlanSchema.PlanIdParam
            },
            handler: (request, h) => RouteHandler.getPlanById(request, h)
        }
    });

    server.route({
        method: 'DELETE',
        path: version + '/plans/{plan_id}/',
        config: {
            description: 'Delete Plan by Plan ID',
            notes: 'Delete all the Plans for the Plan ID',
            tags: ['api','plan'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            validate: {
                params: PlanSchema.PlanIdParam
            },
            handler: (request, h) => RouteHandler.deletePlanById(request, h)
        }
    });

    server.route({
        method: 'POST',
        path: version + '/users/',
        config: {
            description: 'Create User ',
            notes: 'Create a New User in the system with the Correct Values',
            tags: ['api','users'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: UserSchema.userCreatePayload
            },
            handler: (request, h) => RouteHandler.createUser(request, h)
        }
    });

    server.route({
        method: 'PUT',
        path: version + '/users/{user_id}/',
        config: {
            description: 'Update an Existing User ',
            notes: 'Update an Existing User in the system with the Correct Values',
            tags: ['api','users'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: UserSchema.userCreatePayload,
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.updateUser(request, h)
        }
    });

    server.route({
        method: 'PUT',
        path: version + '/users/{user_id}/plans/',
        config: {
            description: 'Update Plan Id for the User ',
            notes: 'Update the New User in the system with the Correct Plan Id',
            tags: ['api','users','plan'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: PlanSchema.PlanIdParam,
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.updateUserPlan(request, h)
        }
    });

    server.route({
        method: 'GET',
        path: version + '/users',
        config: {
            description: 'Search User',
            notes: 'Search for the User with User Email',
            tags: ['api','users'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'query'
                }
            },
            validate: {
                query: UserSchema.EmailQueryParameter
            },
            handler: (request, h) => RouteHandler.GetUserByParam(request, h)
        }
    });


    server.route({
        method: 'GET',
        path: version + '/users/{user_id}/',
        config: {
            description: 'Get User by ID',
            notes: 'Get User Details by User ID',
            tags: ['api','users'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            validate: {
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.GetUserById(request, h)
        }
    });

    server.route({
        method: 'GET',
        path: version + '/users/{user_id}/wallet/balance',
        config: {
            description: 'Get Wallet Balance by User ID',
            notes: 'Get Wallet Details by User ID',
            tags: ['api','wallet'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            validate: {
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.GetWalletByUserId(request, h)
        }
    });

    server.route({
        method: 'PUT',
        path: version + '/users/{user_id}/wallet/funds',
        config: {
            description: 'Put Funds to a user wallet',
            notes: 'Update the wallet balance of a user',
            tags: ['api','wallet'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: WalletSchema.AmountPayload,
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.addWalletFund(request, h)
        }
    });

    server.route({
        method: 'POST',
        path: version + '/users/{user_id}/wallet/redeem',
        config: {
            description: 'Redeem Funds from a user wallet',
            notes: 'Update the wallet balance of a user',
            tags: ['api','wallet'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: WalletSchema.AmountPayload,
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.redeemWalletFund(request, h)
        }
    });

    server.route({
        method: 'POST',
        path: version + '/address/',
        config: {
            description: 'Create New Address ',
            notes: 'Create a New Address for any of the users',
            tags: ['api','address'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: AddressSchema.AddressCreatePayload
            },
            handler: (request, h) => RouteHandler.createAddress(request, h)
        }
    });

    server.route({
        method: 'PUT',
        path: version + '/address/{address_id}/',
        config: {
            description: 'Update an Existing Address',
            notes: 'Update an Address for any of the users',
            tags: ['api','address'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: AddressSchema.AddressCreatePayload,
                params: AddressSchema.AddressIdParam
            },
            handler: (request, h) => RouteHandler.updateAddress(request, h)
        }
    });

    server.route({
        method: 'GET',
        path: version + '/users/{user_id}/addresses',
        config: {
            description: 'Get Addresses',
            notes: 'Get all the addresses for the user',
            tags: ['api','address'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            validate: {
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.getAddresses(request, h)
        }
    });

    server.route({
        method: 'POST',
        path: version + '/cards/',
        config: {
            description: 'Create New Card ',
            notes: 'Create a New Card for any of the users',
            tags: ['api','cards'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: CardSchema.CardCreatePayload
            },
            handler: (request, h) => RouteHandler.createCard(request, h)
        }
    });

    server.route({
        method: 'PUT',
        path: version + '/cards/{card_id}/',
        config: {
            description: 'Update an Existing Card',
            notes: 'Update an Card for any of the users',
            tags: ['api','cards'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: CardSchema.CardCreatePayload,
                params: CardSchema.CardIdParam
            },
            handler: (request, h) => RouteHandler.updateCard(request, h)
        }
    });

    server.route({
        method: 'GET',
        path: version + '/users/{user_id}/cards',
        config: {
            description: 'Get Cards for the User',
            notes: 'Get all the Cards for the user',
            tags: ['api','cards'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            validate: {
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.getCards(request, h)
        }
    });
    
    server.route({
        method: 'GET',
        path: version + '/cards/list',
        config: {
            description: 'Gets the List of Available Card Brands',
            notes: 'Gets the List of Available Card Brands',
            tags: ['api','cards'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            handler: function (request, h) {
                return CardBands;
            }
        }
    });

    server.route({
        method: 'POST',
        path: version + '/requests/',
        config: {
            description: 'Create New Request ',
            notes: 'Create a New Request for any of the users',
            tags: ['api','requests'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: RequestSchema.RequestCreatePayload
            },
            handler: (request, h) => RouteHandler.createRequest(request, h)
        }
    });

    server.route({
        method: 'PUT',
        path: version + '/requests/{request_id}/',
        config: {
            description: 'Update an Existing Request',
            notes: 'Update an Request for any of the users',
            tags: ['api','requests'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: RequestSchema.RequestCreatePayload,
                params: RequestSchema.RequestIdParam
            },
            handler: (request, h) => RouteHandler.updateRequest(request, h)
        }
    });

    server.route({
        method: 'PUT',
        path: version + '/requests/{request_id}/status',
        config: {
            description: 'Update an Existing Request to any of the Statuses - Purchased,Closed,Cancelled',
            notes: 'Update an Existing Request to any of the Statuses - Purchased,Closed,Cancelled',
            tags: ['api','requests'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: RequestSchema.RequestStatusPayload,
                params: RequestSchema.RequestIdParam
            },
            handler: (request, h) => RouteHandler.updateRequestStatus(request, h)
        }
    });

    

    server.route({
        method: 'PUT',
        path: version + '/requests/{request_id}/payment/transaction',
        config: {
            description: 'Update an Payment Transaction ID for the request',
            notes: 'Update an Payment Transaction ID for the request',
            tags: ['api','requests'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: RequestSchema.TransactionIdParam,
                params: RequestSchema.RequestIdParam
            },
            handler: (request, h) => RouteHandler.updatePaymentTransaction(request, h)
        }
    });

    server.route({
        method: 'PUT',
        path: version + '/requests/{request_id}/servicer/payment/account',
        config: {
            description: 'Update an Payment Transaction ID for the request',
            notes: 'Update an Payment Transaction ID for the request',
            tags: ['api','requests'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                payload: RequestSchema.ServicerBankAccountPayload,
                params: RequestSchema.RequestIdParam
            },
            handler: (request, h) => RouteHandler.updateServicerAccountDetails(request, h)
        }
    });

    server.route({
        method: 'GET',
        path: version + '/users/{user_id}/requests',
        config: {
            description: 'Get Requests for the User',
            notes: 'Get all the Requests for the user',
            tags: ['api','requests'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            validate: {
                params: UserSchema.userIdParam,
                query: RequestSchema.GetAllParam
            },
            handler: (request, h) => RouteHandler.getRequests(request, h)
        }
    });

    server.route({
        method: 'GET',
        path: version + '/users/{user_id}/requests/accepted',
        config: {
            description: 'Get the Accepted Requests for the User',
            notes: 'Get all the Accepted Requests for the user',
            tags: ['api','requests'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            validate: {
                params: UserSchema.userIdParam,
                query: RequestSchema.GetAllParam
            },
            handler: (request, h) => RouteHandler.getAcceptedRequests(request, h)
        }
    });

     server.route({
        method: 'GET',
        path: version + '/users/{user_id}/card/requests',
        config: {
            description: 'Get Requests that the user can accept',
            notes: 'Get Requests that the user can accept',
            tags: ['api','requests'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'param'
                }
            },
            validate: {
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.getCardRequests(request, h)
        }
    });

    server.route({
        method: 'PUT',
        path: version + '/users/{user_id}/requests/{request_id}/accept',
        config: {
            description: 'Update an Existing Request',
            notes: 'Update an Request for any of the users',
            tags: ['api','requests'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'json'
                }
            },
            validate: {
                params: RequestSchema.UserRequestIdParam
            },
            handler: (request, h) => RouteHandler.acceptRequest(request, h)
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
