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
const LessonMemberType = require('../types/LessonMember');

// lets import our user resolver
const LessonMemberResolver = require('../resolvers/LessonMember');


module.exports = {

    create() {
        return {
            type: LessonMemberType,
            description: 'Add new lesson member',

            args: {
                lesson_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter lesson id, Cannot be left empty',
                },
                client_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter client id, Cannot be left empty',
                },
                presence: {
                    type: GraphQLBoolean,
                    description: 'Enter lesson  member presence',
                },
                reg_datetime: {
                    type: GraphQLDateTime,
                    description: 'Enter lesson registration datetime',
                },
                
            },
            resolve(parent, fields) {
                return LessonMemberResolver.create(fields);
            }
        }
    },


    update() {
        return {
            type: LessonMemberType,
            description: 'Update lesson details',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter lesson member id',
                },
                lesson_id: {
                    type: GraphQLID,
                    description: 'Enter lesson id',
                },
                client_id: {
                    type: GraphQLID,
                    description: 'Enter client id',
                },
                presence: {
                    type: GraphQLBoolean,
                    description: 'Enter presence',
                },
                reg_datetime: {
                    type: GraphQLDateTime,
                    description: 'Enter registration datetime',
                },
                
            },
            resolve(parent, fields) {
                return LessonMemberResolver.update(fields);
            }

        }
    },


    delete() {
        return {
            type: LessonMemberType,
            description: 'Delete existing lesson member',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter lesson member id',
                },
            },
            resolve(parent, fields) {
                return LessonMemberResolver.delete(fields);
            }
        }
    },


};