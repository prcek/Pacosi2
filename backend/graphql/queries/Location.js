'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

// import the user type we created
const LocationType = require('../types/Location');
const LocationInfoType = require('../types/LocationInfo');

// import the user resolver we created
const LocationResolver = require('../resolvers/Location');

const MassageRoomType = require('./MassageRoom');
const MassageRoomResolver = require('../resolvers/MassageRoom');

module.exports = {

    index() {
        return {
            type: new GraphQLList(LocationType),
            description: 'This will return all the items present in the database',
            resolve(parent, args, context, info) {
                return LocationResolver.index({});
            }
        }
    },

    single() {
        return {
            type: LocationType,
            description: 'This will return data of a single item based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter item id',
                }
            },
            resolve(parent, args, context, info) {
                return LocationResolver.single({ id: args.id });
            }
        }
    },

    info() {
        return {
            type: LocationInfoType,
            description: 'This will return data of a single item based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter item id',
                }
            },
            resolve(parent, args, context, info) {
                return LocationResolver.single({ id: args.id });
            }
        }
    },
    
    infos() {
        return {
            type: new GraphQLList(LocationInfoType),
            description: 'This will return all the items present in the database',
            resolve(parent, args, context, info) {
                return LocationResolver.index({  });
            }
        }
    },

};
