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


    index() {
        return {
            type: new GraphQLList(this.type),
            args: {
                location_id: {
                    type: GraphQLID,
                }
            },
            description: 'List all '+this.type+' records present in the database',
            resolve: (parent, args, context, info) => {
                const filter = this.resolver.location2filter(args.location_id)
                return this.resolver.index(filter);
            }
        }
    }
    index_pages() {
        return {
            type: new GraphQL.GraphQLObjectType({
                name: this.type+'Pages',
                fields: () => ({
                    items: {
                        type: new GraphQLList(this.type)
                    },
                    paginationInfo: {
                        type: this.paginationInfoType
                    }
                }) 
            }),
            args: {
                pagination: {
                    type: new GraphQLNonNull(this.paginationType),
                },
                filter: {
                    type: GraphQLString
                },
                location_id: {
                    type: GraphQLID,
                },
            },
            description: 'List all '+this.type+' records present in the database',
            resolve: (parent, args, context, info) => {
                const filter = {...this.resolver.filterString2filter(args.filter),...this.resolver.location2filter(args.location_id)}
                return this.resolver.index_pages(args.pagination,filter);
            }
        }
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

                location_id: {
                    type: GraphQLID,
                    description: 'Enter location id',
                },
    
                limit: {
                    type: GraphQLInt,
                    description: 'Please max limit',
                }

            },
            resolve(parent, args, context, info) {
                const filter = this.resolver.location2filter(args.location_id)
                return ClientResolver.lookup(args.text,filter,args.limit);
            }
        }
    }

}

module.exports = new ClientQuery();

