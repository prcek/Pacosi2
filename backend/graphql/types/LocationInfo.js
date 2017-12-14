'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const MassageRoomType = require('./MassageRoom');
const MassageRoomResolver = require('../resolvers/MassageRoom');
const LessonTypeType = require('./LessonType');
const LessonTypeResolver = require('../resolvers/LessonType');


const LocationInfoType = new GraphQL.GraphQLObjectType({
    name: 'LocationInfo',
    description: 'Location type for managing all the locations in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the location, Generated automatically by MongoDB',
        },
        name: {
            type: GraphQLString,
            description: 'Name of the location',
        },
        active: {
            type: GraphQLBoolean,
            description: 'Status of the location, whether active or disabled',
        },

        massageRooms: {
            type: new GraphQLList(MassageRoomType),
            description: 'This will return all the massage rooms present in the location',
            resolve(parent, args, context, info) {
                return MassageRoomResolver.search({active:true,location_id:parent.id});
            }
        },

        lessonTypes: {
            type: new GraphQLList(LessonTypeType),
            description: 'This will return all the lesson types present in the location',
            resolve(parent, args, context, info) {
                return LessonTypeResolver.search({active:true,location_id:parent.id});
            }
        },
 
        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this location was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this location was last updated',
        }

    })

});


module.exports = LocationInfoType;
