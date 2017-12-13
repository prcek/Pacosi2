'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLSchema,
} = GraphQL;


// import the user query file we created
const UserQuery = require('./queries/User');
const OrderItemQuery = require('./queries/OrderItem');
const OrderQuery = require('./queries/Order');

// import the user mutation file we created
const UserMutation = require('./mutations/User');
const OrderItemMutation = require('./mutations/OrderItem');
const OrderMutation = require('./mutations/Order');


// lets define our root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'This is the default root query provided by the backend',
    fields: {
        users: UserQuery.index(),
        user: UserQuery.single(),
        orders: OrderQuery.index(),
        order: OrderQuery.single(),
        orderItems: OrderItemQuery.index(),
        orderItem: OrderItemQuery.single(),
    },
});


// lets define our root mutation
const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Default mutation provided by the backend APIs',
    fields: {
        addUser: UserMutation.create(),
        updateUser: UserMutation.update(),
        deleteUser: UserMutation.delete(),
        addOrderItem: OrderItemMutation.create(),
        updateOrderItem: OrderItemMutation.update(),
        deleteOrderItem: OrderItemMutation.delete(),
        addOrder: OrderMutation.create(),
        updateOrder: OrderMutation.update(),
        deleteOrder: OrderMutation.delete(),
    },
});



// export the schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
