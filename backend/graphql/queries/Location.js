'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const LocationType = require('../types/Location');
const LocationInfoType = require('../types/LocationInfo');

const LocationResolver = require('../resolvers/Location');

const MassageRoomType = require('./MassageRoom');
const MassageRoomResolver = require('../resolvers/MassageRoom');

const BaseQuery = require('./BaseQuery');

class LocationQuery extends BaseQuery {

    constructor() {
        super(LocationType,LocationResolver);
    }

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
    }
    
    infos() {
        return {
            type: new GraphQLList(LocationInfoType),
            description: 'This will return all the items present in the database',
            resolve(parent, args, context, info) {
                return LocationResolver.index({  });
            }
        }
    }

}

module.exports = new LocationQuery();

