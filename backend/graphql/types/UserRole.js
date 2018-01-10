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


const UserRoleType =  new GraphQL.GraphQLEnumType({
    name: 'UserRole',
    values: {
        ADMIN:{value:0},
        RECEPTION:{value:1},
        DOCTOR:{value:2}
    }
});



module.exports = UserRoleType;
