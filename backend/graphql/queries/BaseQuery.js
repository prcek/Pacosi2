'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


class BaseQuery {
    constructor(type,resolver) {
        console.log("BaseQuery constructor for type",type,"and model resolver",resolver.model.modelName);
        this.type = type;
        this.resolver = resolver;
    }

    index() {
        return {
            type: new GraphQLList(this.type),
            description: 'List all '+this.type+' records present in the database',
            resolve: (parent, args, context, info) => {
                return this.resolver.index();
            }
        }
    }

    single() {
        return {
            type: this.type,
            description: 'This will return data of a single '+this.type+' based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter '+this.type+' id',
                }
            },
            resolve: (parent, args, context, info) => {
                return this.resolver.single({ id: args.id });
            }
        }
    }

};


module.exports = BaseQuery;