'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

// lets import our user type
const LessonTypeType = require('../types/LessonType');

// lets import our user resolver
const LessonTypeResolver = require('../resolvers/LessonType');


module.exports = {

    create() {
        return {
            type: LessonTypeType,
            description: 'Add new lesson type',

            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter lesson type name, Cannot be left empty',
                },
                location_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter location id, Cannot be left empty',
                },
                active: {
                    type: GraphQLBoolean,
                    description: 'Enters lesson type status, by default its set to active. true: active, false: disabled',
                },
            },
            resolve(parent, fields) {
                return LessonTypeResolver.create(fields);
            }
        }
    },


    update() {
        return {
            type: LessonTypeType,
            description: 'Update lesson type details',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter lesson type id',
                },
                name: {
                    type: GraphQLString,
                    description: 'Enter lesson type name, Cannot be left empty',
                },
                location_id: {
                    type: GraphQLID,
                    description: 'Enter location id',
                },
                active: {
                    type: GraphQLBoolean,
                    description: 'Enters lesson type status. true: active, false: disabled',
                },
            },
            resolve(parent, fields) {
                return LessonTypeResolver.update(fields);
            }

        }
    },


    delete() {
        return {
            type: LessonTypeType,
            description: 'Delete existing lesson type',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter lesson type id',
                },
            },
            resolve(parent, fields) {
                return LessonTypeResolver.delete(fields);
            }
        }
    },


};