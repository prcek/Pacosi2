'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

// lets import our user type
const LocationType = require('../types/Location');

// lets import our user resolver
const LocationResolver = require('../resolvers/Location');


module.exports = {

    create() {
        return {
            type: LocationType,
            description: 'Add new location',

            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter location name, Cannot be left empty',
                },
                active: {
                    type: GraphQLBoolean,
                    description: 'Enters location status, by default its set to active. true: active, false: disabled',
                },
            },
            resolve(parent, fields) {
                return LocationResolver.create(fields);
            }
        }
    },


    update() {
        return {
            type: LocationType,
            description: 'Update location details',

            args: {
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
            },
            resolve(parent, fields) {
                return LocationResolver.update(fields);
            }

        }
    },


    delete() {
        return {
            type: LocationType,
            description: 'Delete existing location type',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter location id',
                },
            },
            resolve(parent, fields) {
                return LocationResolver.delete(fields);
            }
        }
    },


};