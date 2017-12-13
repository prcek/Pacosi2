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
const OrderType = require('../types/Order');

// lets import our user resolver
const OrderResolver = require('../resolvers/Order');


module.exports = {

    create() {
        return {
            type: OrderType,
            description: 'Add new order',

            args: {
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
                
            },
            resolve(parent, fields) {
                return OrderResolver.create(fields);
            }
        }
    },


    update() {
        return {
            type: OrderType,
            description: 'Update order item details',

            args: {
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
                
            },
            resolve(parent, fields) {
                return OrderResolver.update(fields);
            }

        }
    },


    delete() {
        return {
            type: OrderType,
            description: 'Delete existing order item',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter order id',
                },
            },
            resolve(parent, fields) {
                return OrderResolver.delete(fields);
            }
        }
    },


};