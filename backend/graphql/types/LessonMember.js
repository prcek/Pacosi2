'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const LessonType = require('./Lesson');
const LessonResolver = require('../resolvers/Lesson');
const ClientType = require('./Client');
const ClientResolver = require('../resolvers/Client');
const PaymentType = require('./Payment');


const LessonMemberType = new GraphQL.GraphQLObjectType({
    name: 'LessonMember',
    description: 'LessonMember type for managing all the lesson members in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the lesson member, Generated automatically by MongoDB',
        },

        lesson_id: {
            type: GraphQLID,
            description: 'lesson id',
        },

        client_id: {
            type: GraphQLID,
            description: 'client id',
        },

        lesson: {
            type: LessonType,
            description: 'lesson',
            resolve(parent, args, context, info) {
                return LessonResolver.single({ id: parent.lesson_id });
            }
        },

        client: {
            type: ClientType,
            description: 'client',
            resolve(parent, args, context, info) {
                return ClientResolver.single({ id: parent.client_id });
            }
        },
 
        presence: {
            type: GraphQLBoolean,
            description: 'presence'
        },
      
        comment: {
            type: GraphQLString,
            description: 'comment'
        },
 
    
        payment: {
            type: PaymentType,
            description: 'payment type',
        },

        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this lesson was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this lesson was last updated',
        }

    })

});


module.exports = LessonMemberType;
