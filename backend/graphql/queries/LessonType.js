'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

// import the user type we created
const LessonTypeType = require('../types/LessonType');

// import the user resolver we created
const LessonTypeResolver = require('../resolvers/LessonType');


module.exports = {

    index() {
        return {
            type: new GraphQLList(LessonTypeType),
            description: 'This will return all the items present in the database',
            resolve(parent, args, context, info) {
                return LessonTypeResolver.index({});
            }
        }
    },

    single() {
        return {
            type: LessonTypeType,
            description: 'This will return data of a single item based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter item id',
                }
            },
            resolve(parent, args, context, info) {
                return LessonTypeResolver.single({ id: args.id });
            }
        }
    },

};
