'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const OrderType = require('../types/Order');
const OrderResolver = require('../resolvers/Order');
const BaseQuery = require('./BaseQuery');
const OrderItemType = require('../types/OrderItem');
const UserType = require('../types/User') 


const OrderReportType = new GraphQL.GraphQLObjectType({
    name: 'OrderReport',
   

    fields: () => ({
        user_id: {
            type: GraphQLID,
        },
        user: {
            type: UserType
        },
        order_item_id: {
            type: GraphQLID,
        },
        order_item: {
            type: OrderItemType
        },
        count: {
            type: GraphQLInt,
        },
        price: {
            type: GraphQLInt,
        },
    })

});


class OrderQuery extends BaseQuery {

    constructor() {
        super(OrderType,OrderResolver);
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
                const filter = {...this.resolver.filterString2filter(args.filter)}
                return this.resolver.index_pages(args.pagination,filter);
            }
        }
    }


    report() {
        return {
            type: new GraphQLList(OrderReportType),
            args: {
                user_id: {
                    type: new GraphQLNonNull(GraphQLID),
                },
                begin_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter begin date',
                },
                end_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter end date',
                }
            },
            resolve(parent, args, context, info) {
                return OrderResolver.report(args)
            }

        }
    }
}

module.exports = new OrderQuery();
