'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


// lets import our user type
const TestType = require('../types/Test');
const TestResolver = require('../resolvers/Test');
const BaseMutation = require('./BaseMutation');


class TestMutation extends BaseMutation {
    constructor() {
        super(TestType,TestResolver);
    }

 
    create_args() {
        return {
            hello: {
                type: GraphQLString,
            },
            world: {
                type: GraphQLString
            }
        }
    }
 
    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
            },
            hello: {
                type: GraphQLString,
            },
            world: {
                type: GraphQLString
            }
        }
    }
     
};

module.exports = new TestMutation();