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


// import the user type we created
const LessonType = require('../types/Lesson');
const LessonInfoType = require('../types/LessonInfo');
const LessonTypeType = require('../types/LessonType');
const LessonTypeResolver = require('../resolvers/LessonType');

// import the user resolver we created
const LessonResolver = require('../resolvers/Lesson');

const LocationType = require('../types/Location');
const LocationResolver = require('../resolvers/Location');

const BaseQuery = require('./BaseQuery');

const LessonReportType = new GraphQL.GraphQLObjectType({
    name: 'LessonReport',
   

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


class LessonQuery extends BaseQuery {

    constructor() {
        super(LessonType,LessonResolver);
    }
    info() {
        return {
            type: LessonInfoType,
            description: 'This will return data of a single item based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter item id',
                }
            },
            resolve(parent, args, context, info) {
                return LessonResolver.single({ id: args.id });
            }
        }
    }
    
    infos() {
        return {
            type: new GraphQLList(LessonInfoType),
            description: 'This will return all the items present in the database',
            args: {
                lesson_type_id: {
                    type: GraphQLID,
                    description: 'Please enter lesson type id',
                },
                date: {
                    type: GraphQLDate,
                    description: 'Please enter lesson date',
                }
            },
            resolve(parent, args, context, info) {
                let srch = {};
                if (args.lesson_type_id) {
                    srch.lesson_type_id=args.lesson_type_id
                }
                if (args.date) {
                    srch.datetime={"$gte":args.date,"$lt":new Date(args.date.getTime()+ (24 * 60 * 60 * 1000))}
                }
                return LessonResolver.index(srch);
            }
        }
    }

    report() {
        return {
            type: new GraphQLList(LessonReportType),
            args: {
                location_id: {
                    type: GraphQLID,
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
                return LessonResolver.report(args)
            }

        }
    }


};


module.exports = new LessonQuery();