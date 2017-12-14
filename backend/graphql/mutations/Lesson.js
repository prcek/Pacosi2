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


// lets import our user type
const LessonType = require('../types/Lesson');

// lets import our user resolver
const LessonResolver = require('../resolvers/Lesson');


module.exports = {

    create() {
        return {
            type: LessonType,
            description: 'Add new lesson',

            args: {
                lesson_type_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter lesson type id, Cannot be left empty',
                },
                capacity: {
                    type: new GraphQLNonNull(GraphQLInt),
                    description: 'Enter lesson capacity, Cannot be left empty',
                },
                datetime: {
                    type: new GraphQLNonNull(GraphQLDateTime),
                    description: 'Enter lesson datetime, Cannot be left empty',
                },
                
            },
            resolve(parent, fields) {
                return LessonResolver.create(fields);
            }
        }
    },


    update() {
        return {
            type: LessonType,
            description: 'Update lesson details',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter lesson id',
                },
                lesson_type_id: {
                    type: GraphQLID,
                    description: 'Enter lesson type id',
                },
                capacity: {
                    type: GraphQLInt,
                    description: 'Enter lesson capacity',
                },
                datetime: {
                    type: GraphQLDateTime,
                    description: 'Enter lesson datetime',
                },
                
            },
            resolve(parent, fields) {
                return LessonResolver.update(fields);
            }

        }
    },


    delete() {
        return {
            type: LessonType,
            description: 'Delete existing lesson',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter lesson id',
                },
            },
            resolve(parent, fields) {
                return LessonResolver.delete(fields);
            }
        }
    },


};