'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


const TestType = new GraphQL.GraphQLObjectType({
    name: 'Test',
    description: 'test type',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the lesson, Generated automatically by MongoDB',
        },
        hello: {
            type: GraphQLString,
        },
        world: {
            type: GraphQLString,
        },
    })

});


module.exports = TestType;
