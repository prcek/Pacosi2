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

const LocationType = require('./Location');
const LocationResolver = require('../resolvers/Location');


const LessonTypeType = new GraphQL.GraphQLObjectType({
    name: 'LessonType',
    description: 'LessonType type for managing all the lesson types in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the lesson type, Generated automatically by MongoDB',
        },

        location_id: {
            type: GraphQLID,
            description: 'location id',
        },
        
        location: {
            type: LocationType,
            description: 'location',
            resolve(parent, args, context, info) {
                return LocationResolver.single({ id: parent.location_id });
            }
        },

        name: {
            type: GraphQLString,
            description: 'Name of the lesson type',
        },
        active: {
            type: GraphQLBoolean,
            description: 'Status of the lesson type, whether active or disabled',
        },

        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this lesson type was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this lesson type was last updated',
        }

    })

});


module.exports = LessonTypeType;
