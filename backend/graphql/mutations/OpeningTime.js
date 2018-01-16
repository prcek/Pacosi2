'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


const OpeningTimeType = require('../types/OpeningTime');
const OpeningTimeResolver = require('../resolvers/OpeningTime');
const BaseMutation = require('./BaseMutation');


class OpeningTimeMutation extends BaseMutation {
    constructor() {
        super(OpeningTimeType,OpeningTimeResolver);
    }


    create_args() {
        return  {
            massage_room_id: {
                type: GraphQLID,
                description: 'Enter massage room id',
            },
            /*
            surgery_room_id: {
                type: GraphQLID,
                description: 'Enter surgery room id',
            },
            */
            begin: {
                type: new GraphQLNonNull(GraphQLDateTime),
                description: 'Enter start time, Cannot be left empty',
            },
            end: {
                type: new GraphQLNonNull(GraphQLDateTime),
                description: 'Enter end time, Cannot be left empty',
            },
            
        }
    }

    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter id',
            },
            massage_room_id: {
                type: GraphQLID,
                description: 'Enter massage room id',
            },
            /*
            surgery_room_id: {
                type: GraphQLID,
                description: 'Enter surgery room id',
            },
            */
            begin: {
                type: GraphQLDateTime,
                description: 'Enter start time',
            },
            end: {
                type: GraphQLDateTime,
                description: 'Enter end time',
            },
           
        };
    }
}

module.exports = new OpeningTimeMutation();
