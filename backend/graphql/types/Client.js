'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


const ClientType = new GraphQL.GraphQLObjectType({
    name: 'Client',
    description: 'User type for managing all the clients in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the client, Generated automatically by MongoDB',
        },
        no: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString,
            description: 'Name of the client',
        },
        surname: {
            type: GraphQLString,
            description: 'Surname of the client',
        },
        email: {
            type: GraphQLString,
            description: 'Email address of the client',
        },
        comment: {
            type: GraphQLString,
            description: 'Comment of the client',
        },

        phone: {
            type: GraphQLString,
            description: 'Phone number of the client',
        },
        year: {
            type: GraphQLInt
        },
        street: {
            type: GraphQLString,
            description: 'Street of the client',
        },

        city: {
            type: GraphQLString,
            description: 'Street of the client',
        },

        active: {
            type: GraphQLBoolean,
            description: 'Status of the client, whether active or disabled',
        },
        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this client was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this client was last updated',
        }

    })

});


module.exports = ClientType;
