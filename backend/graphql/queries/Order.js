'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const OrderType = require('../types/Order');
const OrderResolver = require('../resolvers/Order');
const BaseQuery = require('./BaseQuery');

class OrderQuery extends BaseQuery {

    constructor() {
        super(OrderType,OrderResolver);
    }

}

module.exports = new OrderQuery();
