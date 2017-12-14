'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

// import the user type we created
const LessonMemberType = require('../types/LessonMember');

// import the user resolver we created
const LessonMemberResolver = require('../resolvers/LessonMember');


module.exports = {

    index() {
        return {
            type: new GraphQLList(LessonMemberType),
            description: 'This will return all the lessons members present in the database',
            resolve(parent, args, context, info) {
                return LessonMemberResolver.index({});
            }
        }
    },

    single() {
        return {
            type: LessonMemberType,
            description: 'This will return data of a single lesson member based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter lesson member id',
                }
            },
            resolve(parent, args, context, info) {
                return LessonMemberResolver.single({ id: args.id });
            }
        }
    },

};
