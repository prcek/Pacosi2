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
            active: {
                type: GraphQLBoolean,
                description: 'Enters location status, by default its set to active. true: active, false: disabled',
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
            active: {
                type: GraphQLBoolean,
                description: 'Enters location status. true: active, false: disabled',
            },
        };
    }
}


module.exports = new LocationMutation();
