'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

// lets import our user type
const ClientType = require('../types/Client');

// lets import our user resolver
const ClientResolver = require('../resolvers/Client');


module.exports = {

    create() {
        return {
            type: ClientType,
            description: 'Add new client',

            args: {
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
                },
            },
            resolve(parent, fields) {
                return ClientResolver.create(fields);
            }
        }
    },


    update() {
        return {
            type: ClientType,
            description: 'Update client details',

            args: {
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
            },
            resolve(parent, fields) {
                return ClientResolver.update(fields);
            }

        }
    },


    delete() {
        return {
            type: ClientType,
            description: 'Delete existing client',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter user id',
                },
            },
            resolve(parent, fields) {
                return UserResolver.delete(fields);
            }
        }
    },


};