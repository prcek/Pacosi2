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
const StatusType = require('../types/Status');
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
            status: {
                type: new GraphQLNonNull(StatusType),
                description: 'Enters massageroom status, by default its set to active. 1: active, 2: disabled',
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
            status: {
                type: StatusType,
                description: 'Enters status, by default its set to active. 1: active, 2: disabled',
            },
        };
    }
}

module.exports = new MassageRoomMutation();

