'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const MassageRoomType = require('../types/MassageRoom');
const MassageRoomResolver = require('../resolvers/MassageRoom');
const BaseMutation = require('./BaseMutation');


class MassageRoomMutation extends BaseMutation {
    constructor() {
        super(MassageRoomType,MassageRoomResolver);
    }
    create_args() {
        return {
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
        };
    }
    update_args() {
        return {
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
        };
    }
}

module.exports = new MassageRoomMutation();

