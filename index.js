'use strict';

const Hapi = require('@hapi/hapi');
const UserSchema = require('./lib/schema/user-schema.js');
const AddressSchema = require('./lib/schema/address-schema.js');
const CardSchema = require('./lib/schema/card-schema.js');
const RequestSchema = require('./lib/schema/request-schema.js');

const RouteHandler = require('./lib/routes/route-handler.js');
const version = '/v1';
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

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
            grouping:'tags'
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
                params: UserSchema.userIdParam
            },
            handler: (request, h) => RouteHandler.getRequests(request, h)
        }
    });

     server.route({
        method: 'GET',
        path: version + '/users/{user_id}/card/requests',
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
