'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const ClientType = require('../types/Client');
const ClientResolver = require('../resolvers/Client');
const BaseMutation = require('./BaseMutation');


class ClientMutation extends BaseMutation {
    constructor() {
        super(ClientType,ClientResolver);
    }

    create_args() {
        return {
            surname: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Enter client surname, Cannot be left empty',
            },
            name: {
                type: GraphQLString,
                description: 'Enter client name',
            },
            email: {
                type: GraphQLString,
                description: 'Enter client email address',
            },
            phone: {
                type: GraphQLString,
                description: 'Enter client phone number',
            },
            street: {
                type: GraphQLString,
                description: 'Enter client street',
            },
            city: {
                type: GraphQLString,
                description: 'Enter client city',
            },
            active: {
                type: GraphQLBoolean,
                description: 'Enters client status, by default its set to active. true: active, false: disabled',
            }
        }
    }

    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter client id',
            },
            name: {
                type: GraphQLString,
                description: 'Enter client name, Cannot be left empty',
            },
            surname: {
                type: GraphQLString,
                description: 'Enter client surname, Cannot be left empty',
            },
            email: {
                type: GraphQLString,
                description: 'Enter client email address',
            },
            phone: {
                type: GraphQLString,
                description: 'Enter client phone number',
            },
            street: {
                type: GraphQLString,
                description: 'Enter client street',
            },
            city: {
                type: GraphQLString,
                description: 'Enter client city',
            },
            active: {
                type: GraphQLBoolean,
                description: 'Enters users status. true: active, false: disabled',
            },
        }
    }
};

module.exports = new ClientMutation();