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


const LessonMemberType = require('../types/LessonMember');
const LessonMemberResolver = require('../resolvers/LessonMember');
const BaseMutation = require('./BaseMutation');


class LessonMemberMutation extends BaseMutation {
    constructor() {
        super(LessonMemberType,LessonMemberResolver);
    }

    create_args() {
        return {
            lesson_id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter lesson id, Cannot be left empty',
            },
            client_id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter client id, Cannot be left empty',
            },
            presence: {
                type: GraphQLBoolean,
                description: 'Enter lesson  member presence',
            }
            
        }
    }

    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter lesson member id',
            },
            lesson_id: {
                type: GraphQLID,
                description: 'Enter lesson id',
            },
            client_id: {
                type: GraphQLID,
                description: 'Enter client id',
            },
            presence: {
                type: GraphQLBoolean,
                description: 'Enter presence',
            }
            
        }
    }
}

module.exports = new LessonMemberMutation();

