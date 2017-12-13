'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

// import the user type we created
const OrderType = require('../types/Order');

// import the user resolver we created
const OrderResolver = require('../resolvers/Order');


module.exports = {

    index() {
        return {
            type: new GraphQLList(OrderType),
            description: 'This will return all the orders present in the database',
            resolve(parent, args, context, info) {
                return OrderResolver.index({});
            }
        }
    },

    single() {
        return {
            type: OrderType,
            description: 'This will return data of a single order based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter order id',
                }
            },
            resolve(parent, args, context, info) {
                return OrderResolver.single({ id: args.id });
            }
        }
    },

};
