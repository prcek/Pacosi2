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


const LocationType = new GraphQL.GraphQLObjectType({
    name: 'Location',
    description: 'Location type for managing all the locations in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the location, Generated automatically by MongoDB',
        },
        name: {
            type: GraphQLString,
            description: 'Name of the location',
        },
        active: {
            type: GraphQLBoolean,
            description: 'Status of the location, whether active or disabled',
        },

        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this location was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this location was last updated',
        }

    })

});


module.exports = LocationType;
