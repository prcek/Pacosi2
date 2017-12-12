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


module.exports = {

    create() {
        return {
            type: OrderItemType,
            description: 'Add new order item',

            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter order item name, Cannot be left empty',
                },
                active: {
                    type: GraphQLBoolean,
                    description: 'Enters order item status, by default its set to active. true: active, false: disabled',
                },
            },
            resolve(parent, fields) {
                return OrderItemResolver.create(fields);
            }
        }
    },


    update() {
        return {
            type: OrderItemType,
            description: 'Update order item details',

            args: {
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
            },
            resolve(parent, fields) {
                return OrderItemResolver.update(fields);
            }

        }
    },


    delete() {
        return {
            type: OrderItemType,
            description: 'Delete existing order item',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter order item id',
                },
            },
            resolve(parent, fields) {
                return OrderItemResolver.delete(fields);
            }
        }
    },


};