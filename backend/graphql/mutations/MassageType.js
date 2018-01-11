'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const MassageTypeType = require('../types/MassageType');
const StatusType = require('../types/Status');
const MassageTypeResolver = require('../resolvers/MassageType');
const BaseMutation = require('./BaseMutation');


class MassageTypeMutation extends BaseMutation {
    constructor() {
        super(MassageTypeType,MassageTypeResolver);
    }
    create_args() {
        return {
            name: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Enter Massage type name, Cannot be left empty',
            },
            length: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'Enter Massage type length, Cannot be left empty',
            },
            status: {
                type: new GraphQLNonNull(StatusType),
                description: 'Enters status, by default its set to active. 1: active, 2: disabled',
            },
        };
    }
    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter Massage type id',
            },
            name: {
                type: GraphQLString,
                description: 'Enter Massage type name, Cannot be left empty',
            },
            length: {
                type: GraphQLInt,
                description: 'Enter Massage type length, Cannot be left empty',
            },
            status: {
                type: StatusType,
                description: 'Enters status, by default its set to active. 1: active, 2: disabled',
            },
        };
    }
}

module.exports = new MassageTypeMutation();
