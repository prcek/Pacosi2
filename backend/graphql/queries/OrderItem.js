'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

// import the user type we created
const OrderItemType = require('../types/OrderItem');

// import the user resolver we created
const OrderItemResolver = require('../resolvers/OrderItem');


module.exports = {

    index() {
        return {
            type: new GraphQLList(OrderItemType),
            description: 'This will return all the items present in the database',
            resolve(parent, args, context, info) {
                return OrderItemResolver.index({});
            }
        }
    },

    single() {
        return {
            type: OrderItemType,
            description: 'This will return data of a single item based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter item id',
                }
            },
            resolve(parent, args, context, info) {
                return OrderItemResolver.single({ id: args.id });
            }
        }
    },

};
