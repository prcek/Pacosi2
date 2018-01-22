'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
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
