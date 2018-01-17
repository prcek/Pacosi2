'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const MassageOrderType = require('../types/MassageOrder');
const MassageOrderResolver = require('../resolvers/MassageOrder');
const BaseQuery = require('./BaseQuery');

class MassageOrderQuery extends BaseQuery {

    constructor() {
        super(MassageOrderType,MassageOrderResolver);
    }

}

module.exports = new MassageOrderQuery();
