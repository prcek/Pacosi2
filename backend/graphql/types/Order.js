'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const OrderItemType = require('./OrderItem');
const UserType = require('./User');
const OrderItemResolver = require('../resolvers/OrderItem');
const UserResolver = require('../resolvers/User');


const OrderType = new GraphQL.GraphQLObjectType({
    name: 'Order',
    description: 'Order type for managing all the orders in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the item, Generated automatically by MongoDB',
        },

        order_item_id: {
            type: GraphQLID,
            description: 'order item id',
        },
        user_id: {
            type: GraphQLID,
            description: 'user id',
        },
        
        order_item: {
            type: OrderItemType,
            description: 'order item',
            resolve(parent, args, context, info) {
                return OrderItemResolver.single({ id: parent.order_item_id });
            }
        },
        user: {
            type: UserType,
            description: 'user',
            resolve(parent, args, context, info) {
                return UserResolver.single({ id: parent.user_id });
            }
        },
        
        total_price: {
            type: GraphQLInt,
            description: 'order price'
        },

        count: {
            type: GraphQLInt,
            description: 'unit count',
        },

        customer_name: {
            type: GraphQLString,
            description: 'customer name'
        },
        
        date: {
            type: GraphQLDate,
            description: 'order date',
        },

        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this order was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this order was last updated',
        }

    })

});


module.exports = OrderType;
