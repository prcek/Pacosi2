'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt
} = GraphQL;

const ClientType = require('../types/Client');
const ClientResolver = require('../resolvers/Client');
const BaseQuery = require('./BaseQuery');

class ClientQuery extends BaseQuery {

    constructor() {
        super(ClientType,ClientResolver);
    }

    lookup() {
        return {
            type: new GraphQLList(ClientType),
            description: 'This will return data of a single client based on the id provided',
            args: {
                text: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Please enter text',
                },
                limit: {
                    type: GraphQLInt,
                    description: 'Please max limit',
                }

            },
            resolve(parent, args, context, info) {
                return ClientResolver.lookup(args.text,args.limit);
            }
        }
    }

}

module.exports = new ClientQuery();

