'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const OrderItemType = require('../types/OrderItem');
const StatusType = require('../types/Status');
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
            status: {
                type: new GraphQLNonNull(StatusType),
                description: 'Enters order item status, by default its set to active. 1: active, 2: disabled',
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
            status: {
                type: StatusType,
                description: 'Enters order item status. 1: active, 2: disabled',
            },
       };
    }
}

module.exports = new OrderItemMutation();
