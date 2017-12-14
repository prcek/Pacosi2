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


const MassageRoomType = new GraphQL.GraphQLObjectType({
    name: 'MassageRoom',
    description: 'MassageRoom type for managing all the massage rooms in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the massage room, Generated automatically by MongoDB',
        },
        name: {
            type: GraphQLString,
            description: 'Name of the massage room',
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

        active: {
            type: GraphQLBoolean,
            description: 'Status of the massage room, whether active or disabled',
        },

        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this massage room was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this massage room was last updated',
        }

    })

});


module.exports = MassageRoomType;
