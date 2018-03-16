'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInt
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const LessonMemberType = require('../types/LessonMember');
const LessonMemberResolver = require('../resolvers/LessonMember');
const LessonTypeType = require('../types/LessonType');
const LessonTypeResolver = require('../resolvers/LessonType');
const BaseQuery = require('./BaseQuery');

const LessonMemberReportType = new GraphQL.GraphQLObjectType({
    name: 'LessonMemberReport',
   

    fields: () => ({

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

        count: {
            type: GraphQLInt,
        },
    })

});


class LessonMemberQuery extends BaseQuery {

    constructor() {
        super(LessonMemberType,LessonMemberResolver);
    }

    report() {
        return {
            type: new GraphQLList(LessonMemberReportType),
            args: {
                location_id: {
                    type: new GraphQLNonNull(GraphQLID),
                },
                begin_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter begin date',
                },
                end_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter end date',
                }
            },
            resolve(parent, args, context, info) {
                return LessonMemberResolver.report(args)
            }

        }
    }
}

module.exports = new LessonMemberQuery();
