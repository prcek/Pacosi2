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


// import the user type we created
const LessonType = require('../types/Lesson');
const LessonInfoType = require('../types/LessonInfo');

// import the user resolver we created
const LessonResolver = require('../resolvers/Lesson');


module.exports = {

    index() {
        return {
            type: new GraphQLList(LessonType),
            description: 'This will return all the lessons present in the database',
            resolve(parent, args, context, info) {
                return LessonResolver.index({});
            }
        }
    },

    single() {
        return {
            type: LessonType,
            description: 'This will return data of a single lesson based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter lesson id',
                }
            },
            resolve(parent, args, context, info) {
                return LessonResolver.single({ id: args.id });
            }
        }
    },
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
    },
    
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
                return LessonResolver.search(srch);
            }
        }
    },

};
