'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

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
            resolve(parent, args, context, info) {
                return LessonResolver.index({  });
            }
        }
    },

};
