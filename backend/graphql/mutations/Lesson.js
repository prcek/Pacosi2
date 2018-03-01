'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLList,
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


const LessonType = require('../types/Lesson');
const LessonResolver = require('../resolvers/Lesson');
const BaseMutation = require('./BaseMutation');


class LessonMutation extends BaseMutation {
    constructor() {
        super(LessonType,LessonResolver);
    }

    multi_create() {
        return {
            type: new GraphQLList(this.type),
            description: 'MultiCreate new '+this.type+' records',
            args:  {
                lesson_type_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter lesson type id, Cannot be left empty',
                },
                capacity: {
                    type: new GraphQLNonNull(GraphQLInt),
                    description: 'Enter lesson capacity, Cannot be left empty',
                },
                datetimes: {
                    type: new GraphQLNonNull(new GraphQLList(GraphQLDateTime)),
                    description: 'Enter lesson datetimes, Cannot be left empty',
                },
            },
            resolve: (parent, fields) => {
                return this.resolver.multi_create(fields);
            }
        }
    }

    create_args() {
        return  {
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
            
        }
    }

    update_args() {
        return {
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
            
        };
    }
}

module.exports = new LessonMutation();
