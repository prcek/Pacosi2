'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const MassageTypeType = require('../types/MassageType');
const MassageTypeResolver = require('../resolvers/MassageType');
const BaseQuery = require('./BaseQuery');

class MassageTypeQuery extends BaseQuery {

    constructor() {
        super(MassageTypeType,MassageTypeResolver);
    }

}

module.exports = new MassageTypeQuery();
