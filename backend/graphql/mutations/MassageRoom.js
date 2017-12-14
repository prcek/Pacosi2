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
const MassageRoomType = require('../types/MassageRoom');

// lets import our user resolver
const MassageRoomResolver = require('../resolvers/MassageRoom');


module.exports = {

    create() {
        return {
            type: MassageRoomType,
            description: 'Add new Massage room',

            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter Massage room name, Cannot be left empty',
                },
                location_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter location id, Cannot be left empty',
                },
                active: {
                    type: GraphQLBoolean,
                    description: 'Enters Massage root status, by default its set to active. true: active, false: disabled',
                },
            },
            resolve(parent, fields) {
                return MassageRoomResolver.create(fields);
            }
        }
    },


    update() {
        return {
            type: MassageRoomType,
            description: 'Update Massage room details',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter Massage room id',
                },
                name: {
                    type: GraphQLString,
                    description: 'Enter Massage room name',
                },
                location_id: {
                    type: GraphQLID,
                    description: 'Enter location id',
                },
                active: {
                    type: GraphQLBoolean,
                    description: 'Enters Massage room status. true: active, false: disabled',
                },
            },
            resolve(parent, fields) {
                return MassageRoomResolver.update(fields);
            }

        }
    },


    delete() {
        return {
            type: MassageRoomType,
            description: 'Delete existing Massage room',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter Massage room id',
                },
            },
            resolve(parent, fields) {
                return MassageRoomResolver.delete(fields);
            }
        }
    },


};