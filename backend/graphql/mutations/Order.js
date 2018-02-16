'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const OrderType = require('../types/Order');
const OrderResolver = require('../resolvers/Order');
const BaseMutation = require('./BaseMutation');


class OrderMutation extends BaseMutation {
    constructor() {
        super(OrderType,OrderResolver);
    }
    create_args() {
        return {
            order_item_id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order item id, Cannot be left empty',
            },
            user_id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order user id, Cannot be left empty',
            },
            total_price: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'Enter order price, Cannot be left empty',
            },
            count: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'Enter order items count, Cannot be left empty',
            },

            customer_name: {
                type: GraphQLString,
                description: 'Enter order customer name',
            },
            
            date: {
                type: new GraphQLNonNull(GraphQLDate),
                description: 'Enter order date, Cannot be left empty',
            },

        }
    }
    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order item id',
            },
            order_item_id: {
                type: GraphQLID,
                description: 'Enter order item id, Cannot be left empty',
            },
            user_id: {
                type: GraphQLID,
                description: 'Enter order user id, Cannot be left empty',
            },
            total_price: {
                type: GraphQLInt,
                description: 'Enter order price, Cannot be left empty',
            },
            count: {
                type: GraphQLInt,
                description: 'Enter order items count, Cannot be left empty',
            },
            customer_name: {
                type: GraphQLString,
                description: 'Enter order customer name',
            },

            date: {
                type: GraphQLDate,
                description: 'Enter order date, Cannot be left empty',
            },
  
        };
    }
}


module.exports = new OrderMutation();

   