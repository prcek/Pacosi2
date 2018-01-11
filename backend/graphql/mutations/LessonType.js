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
const StatusType = require('../types/Status');
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
            status: {
                type: new GraphQLNonNull(StatusType),
                description: 'Enters lessontype status, by default its set to active. 1: active, 2: disabled',
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
            status: {
                type: StatusType,
                description: 'Enters status, by default its set to active. 1: active, 2: disabled',
            },
        };
    }
}


module.exports = new LessonTypeMutation();
