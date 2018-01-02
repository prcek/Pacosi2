'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

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
            price: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'Enter order price, Cannot be left empty',
            },
            count: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'Enter order items count, Cannot be left empty',
            },

            custumer_name: {
                type: GraphQLString,
                description: 'Enter order customer name',
            },
            
        }
    }
    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order item id',
            },
            order_item: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order item id, Cannot be left empty',
            },
            user: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order user id, Cannot be left empty',
            },
            price: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'Enter order price, Cannot be left empty',
            },
            count: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'Enter order items count, Cannot be left empty',
            },
            custumer_name: {
                type: GraphQLString,
                description: 'Enter order customer name',
            },
            
        };
    }
}


module.exports = new OrderMutation();

   