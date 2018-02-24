'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const DayStatusType = require('../types/DayStatus');
const LessonTypeType = require('../types/LessonType');
const LessonTypeResolver = require('../resolvers/LessonType');
const BaseQuery = require('./BaseQuery');


const LessonTypeDayInfoType = new GraphQL.GraphQLObjectType({
    name: 'LessonTypeDayInfo',
   

    fields: () => ({
        date: {
            type: GraphQLDate,
        },
        status: {
            type: DayStatusType
        }
    })

});


class LessonTypeQuery extends BaseQuery {

    constructor() {
        super(LessonTypeType,LessonTypeResolver);
    }


    dayInfos() {
        return {
            type: new GraphQLList(LessonTypeDayInfoType),
            description: 'This will return all the items present in the database',
            args: {
                lesson_type_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter lesson type id',
                },
                begin_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter  begin date',
                },
                end_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter end date',
                }
            },
            resolve(parent, args, context, info) {
                return LessonTypeResolver.dayInfos(args);
            }
        }
    }

}

module.exports = new LessonTypeQuery();

