'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


// lets import our user type
const LessonType = require('../types/Lesson');

// lets import our user resolver
const LessonResolver = require('../resolvers/Lesson');

const BaseMutation = require('./BaseMutation');


class LessonMutation extends BaseMutation {
    constructor() {
        super(LessonType,LessonResolver);
    }


    create_args() {
        return  {
            lesson_type_id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter lesson type id, Cannot be left empty',
            },
            capacity: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'Enter lesson capacity, Cannot be left empty',
            },
            datetime: {
                type: new GraphQLNonNull(GraphQLDateTime),
                description: 'Enter lesson datetime, Cannot be left empty',
            },
            
        }
    }

    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter lesson id',
            },
            lesson_type_id: {
                type: GraphQLID,
                description: 'Enter lesson type id',
            },
            capacity: {
                type: GraphQLInt,
                description: 'Enter lesson capacity',
            },
            datetime: {
                type: GraphQLDateTime,
                description: 'Enter lesson datetime',
            },
            
        };
    }
}

module.exports = new LessonMutation();
