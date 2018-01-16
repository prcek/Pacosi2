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



const OpeningTimeType = new GraphQL.GraphQLObjectType({
    name: 'OpeningTime',
    description: 'OpeningTime type for managing opening hours',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the OpeningTime type, Generated automatically by MongoDB',
        },

        massage_room_id: {
            type: GraphQLID,
            description: 'ID of the MassageRoom'
        },
        /*
        surgery_room_id: {
            type: GraphQLID,
            description: 'ID of the SurgeryRoom'
        },
        */
        begin: {
            type: GraphQLDateTime,
            description: 'Begin time',
        },
        end: {
            type: GraphQLDateTime,
            description: 'End time',
        },

        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this type was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this type was last updated',
        }

    })

});


module.exports = OpeningTimeType;
