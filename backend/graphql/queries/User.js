'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const UserType = require('../types/User');
const UserResolver = require('../resolvers/User');
const BaseQuery = require('./BaseQuery');

class UserQuery extends BaseQuery {

    constructor() {
        super(UserType,UserResolver);
    }

}

module.exports = new UserQuery();

