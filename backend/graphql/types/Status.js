'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


const StatusType =  new GraphQL.GraphQLEnumType({
    name: 'Status',
    values: {
        ACTIVE:{value:1},
        DISABLED:{value:2},
    }
});



module.exports = StatusType;
