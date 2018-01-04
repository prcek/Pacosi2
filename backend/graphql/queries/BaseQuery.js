'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


const PaginationType = new GraphQL.GraphQLInputObjectType({
    name: 'Pagination',
   

    fields: () => ({
        pageNo: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        pageLength: {
            type: new GraphQLNonNull(GraphQLInt),
        },
    })

});

const PaginationInfoType = new GraphQL.GraphQLObjectType({
    name: 'PaginationInfo',
   

    fields: () => ({
        pageNo: {
            type: GraphQLInt,
        },
        pageLength: {
            type: GraphQLInt,
        },
        totalPages: {
            type: GraphQLInt,
        },
        totalCount: {
            type: GraphQLInt,
        }
    })

});




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
    index_pages() {
        return {
            type: new GraphQL.GraphQLObjectType({
                name: this.type+'Pages',
                fields: () => ({
                    items: {
                        type: new GraphQLList(this.type)
                    },
                    paginationInfo: {
                        type: PaginationInfoType
                    }
                }) 
            }),
            args: {
                pagination: {
                    type: new GraphQLNonNull(PaginationType),
                }
            },
            description: 'List all '+this.type+' records present in the database',
            resolve: (parent, args, context, info) => {
                return this.resolver.index_pages(args.pagination);
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