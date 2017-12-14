'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

// import the user type we created
const LessonType = require('../types/Lesson');

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

};
