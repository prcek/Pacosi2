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

            location_id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter location id, Cannot be left empty',
            },

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
            comment: {
                type: GraphQLString,
                description: 'Enter client comment',
            },
            phone: {
                type: GraphQLString,
                description: 'Enter client phone number',
            },
            year: {
                type: GraphQLInt,
                description: 'Enter client year',
            },
            street: {
                type: GraphQLString,
                description: 'Enter client street',
            },
            city: {
                type: GraphQLString,
                description: 'Enter client city',
            },

            old_id: {
                type: GraphQLString,
                description: 'Enter old id - from import',
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

            location_id: {
                type: GraphQLID,
                description: 'Enter location id',
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
            comment: {
                type: GraphQLString,
                description: 'Enter client comment',
            },
            phone: {
                type: GraphQLString,
                description: 'Enter client phone number',
            },
            year: {
                type: GraphQLInt,
                description: 'Enter client year',
            },
            street: {
                type: GraphQLString,
                description: 'Enter client street',
            },
            city: {
                type: GraphQLString,
                description: 'Enter client city',
            },

            old_id: {
                type: GraphQLString,
                description: 'Enter old id - from import',
            },

            active: {
                type: GraphQLBoolean,
                description: 'Enters users status. true: active, false: disabled',
            },
        }
    }
};

module.exports = new ClientMutation();