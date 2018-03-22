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



const DayStatusType =  new GraphQL.GraphQLEnumType({
    name: 'DayStatus',
    values: {
        OFF:{value:0},
        FREE:{value:1},
        BUSY:{value:2},
        PROBLEM:{value:3}
    }
});



module.exports = DayStatusType;
