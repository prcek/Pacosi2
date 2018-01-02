'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const OrderItemType = require('../types/OrderItem');
const OrderItemResolver = require('../resolvers/OrderItem');
const BaseQuery = require('./BaseQuery');

class OrderItemQuery extends BaseQuery {

    constructor() {
        super(OrderItemType,OrderItemResolver);
    }

}

module.exports = new OrderItemQuery();

