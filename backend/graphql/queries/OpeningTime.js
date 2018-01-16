'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = GraphQL;



const OpeningTimeType = require('../types/OpeningTime');
const OpeningTimeResolver = require('../resolvers/OpeningTime');
const BaseQuery = require('./BaseQuery');

class OpeningTimeQuery extends BaseQuery {

    constructor() {
        super(OpeningTimeType,OpeningTimeResolver);
    }
        
}

module.exports = new OpeningTimeQuery();
