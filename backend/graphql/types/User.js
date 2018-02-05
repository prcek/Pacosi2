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



const UserRoleType = require('./UserRole');
const StatusType = require('./Status');


const UserType = new GraphQL.GraphQLObjectType({
    name: 'User',
    description: 'User type for managing all the users in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the user, Generated automatically by MongoDB',
        },
        role: {
            type: UserRoleType,
            description: 'User role - Admin,Reception,Doctor'
        },
        name: {
            type: GraphQLString,
            description: 'Full name of the user',
        },
        login: {
            type: GraphQLString,
            description: 'Login name of the user, must unique',
        },
        email: {
            type: GraphQLString,
            description: 'Email address of the user, must be valid and unique',
        },
        status: {
            type: StatusType,
            description: 'Status of the user, whether active or disabled',
        },
        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this users account was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this users account was last updated',
        }

    })

});


module.exports = UserType;
