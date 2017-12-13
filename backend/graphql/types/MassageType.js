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


const MassageTypeType = new GraphQL.GraphQLObjectType({
    name: 'MassageType',
    description: 'MassageType type for managing all the massage types in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the massage type, Generated automatically by MongoDB',
        },
        name: {
            type: GraphQLString,
            description: 'Name of the massage type',
        },
        length: {
            type: GraphQLInt,
            description: 'Length of the massage type',
        },
        active: {
            type: GraphQLBoolean,
            description: 'Status of the massage type, whether active or disabled',
        },

        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this massage type was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this massage type was last updated',
        }

    })

});


module.exports = MassageTypeType;
