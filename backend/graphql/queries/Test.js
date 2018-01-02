'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


const TestType = require('../types/Test');
const TestResolver = require('../resolvers/Test');
const BaseQuery = require('./BaseQuery');

class TestQuery extends BaseQuery {

    constructor() {
        super(TestType,TestResolver);
    }

    hi() {
        return {
            type: TestType,
           
            resolve(parent, args, context, info) {
                return TestResolver.hi({});
            }
        }
    }

};

module.exports = new TestQuery();

