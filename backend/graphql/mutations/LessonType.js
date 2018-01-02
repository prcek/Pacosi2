'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const LessonTypeType = require('../types/LessonType');
const LessonTypeResolver = require('../resolvers/LessonType');
const BaseMutation = require('./BaseMutation');


class LessonTypeMutation extends BaseMutation {
    constructor() {
        super(LessonTypeType,LessonTypeResolver);
    }
    create_args() {
        return {
            name: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Enter lesson type name, Cannot be left empty',
            },
            location_id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter location id, Cannot be left empty',
            },
            active: {
                type: GraphQLBoolean,
                description: 'Enters lesson type status, by default its set to active. true: active, false: disabled',
            },
        };
    }
    
    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter lesson type id',
            },
            name: {
                type: GraphQLString,
                description: 'Enter lesson type name, Cannot be left empty',
            },
            location_id: {
                type: GraphQLID,
                description: 'Enter location id',
            },
            active: {
                type: GraphQLBoolean,
                description: 'Enters lesson type status. true: active, false: disabled',
            },
        };
    }
}


module.exports = new LessonTypeMutation();
