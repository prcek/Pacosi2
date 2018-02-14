'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const LocationType = require('../types/Location');
const LocationResolver = require('../resolvers/Location');
const BaseMutation = require('./BaseMutation');
const StatusType = require('../types/Status');


class LocationMutation extends BaseMutation {
    constructor() {
        super(LocationType,LocationResolver);
    }
    create_args() {
        return {
            name: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Enter location name, Cannot be left empty',
            },
            status: {
                type: new GraphQLNonNull(StatusType),
                description: 'Enters status, by default its set to active. 1: active, 2: disabled',
            },
        }
    }
    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter location id',
            },
            name: {
                type: GraphQLString,
                description: 'Enter location name',
            },
            status: {
                type: StatusType,
                description: 'Enters status, by default its set to active. 1: active, 2: disabled',
            },
        };
    }
}


module.exports = new LocationMutation();
