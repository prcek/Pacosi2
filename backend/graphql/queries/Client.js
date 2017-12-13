'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

// import the user type we created
const ClientType = require('../types/Client');

// import the user resolver we created
const ClientResolver = require('../resolvers/Client');


module.exports = {

    index() {
        return {
            type: new GraphQLList(ClientType),
            description: 'This will return all the clients present in the database',
            resolve(parent, args, context, info) {
                return ClientResolver.index({});
            }
        }
    },

    single() {
        return {
            type: ClientType,
            description: 'This will return data of a single client based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter client id',
                }
            },
            resolve(parent, args, context, info) {
                return ClientResolver.single({ id: args.id });
            }
        }
    },

};
