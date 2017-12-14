'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,    
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const LessonTypeType = require('./LessonType');
const LessonTypeResolver = require('../resolvers/LessonType');

const LessonMemberType = require('./LessonMember');
const LessonMemberResolver = require('../resolvers/LessonMember');


const LessonInfoType = new GraphQL.GraphQLObjectType({
    name: 'LessonInfo',
    description: 'Lesson type for managing all the orders in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the lesson, Generated automatically by MongoDB',
        },

        lesson_type_id: {
            type: GraphQLID,
            description: 'lesson type id',
        },
        
        lesson_type: {
            type: LessonTypeType,
            description: 'lesson type',
            resolve(parent, args, context, info) {
                return LessonTypeResolver.single({ id: parent.lesson_type_id });
            }
        },
        
        members: {
            type: new GraphQLList(LessonMemberType),
            description: 'This will return all the members present in the lesson',
            resolve(parent, args, context, info) {
                return LessonMemberResolver.search({lesson_id:parent.id});
            }
        },

        members_count: {
            type: GraphQLInt,
            description: 'This will return all the count of members present in the lesson',
            resolve(parent, args, context, info) {
                return LessonMemberResolver.count({lesson_id:parent.id});
            }
        },

        capacity: {
            type: GraphQLInt,
            description: 'capacity'
        },

        datetime: {
            type: GraphQLDateTime,
            description: 'lesson datetime',
        },
        
        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this lesson was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this lesson was last updated',
        }

    })

});


module.exports = LessonInfoType;
