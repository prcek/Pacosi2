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
const OrderItemType = require('../types/OrderItem');

// lets import our user resolver
const OrderItemResolver = require('../resolvers/OrderItem');
const BaseMutation = require('./BaseMutation');


class OrderItemMutation extends BaseMutation {
    constructor() {
        super(OrderItemType,OrderItemResolver);
    }
    create_args() {
        return {
            name: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Enter order item name, Cannot be left empty',
            },
            active: {
                type: GraphQLBoolean,
                description: 'Enters order item status, by default its set to active. true: active, false: disabled',
            },
        };
    }
    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order item id',
            },
            name: {
                type: GraphQLString,
                description: 'Enter order item name, Cannot be left empty',
            },
            active: {
                type: GraphQLBoolean,
                description: 'Enters order item status. true: active, false: disabled',
            },
        };
    }
}

module.exports = new OrderItemMutation();
