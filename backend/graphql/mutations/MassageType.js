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
            active: {
                type: GraphQLBoolean,
                description: 'Enters Massage type status, by default its set to active. true: active, false: disabled',
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
            active: {
                type: GraphQLBoolean,
                description: 'Enters Massage type status. true: active, false: disabled',
            },
        };
    }
}

module.exports = new MassageTypeMutation();
