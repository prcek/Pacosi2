'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = GraphQL;


const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const OpeningTimeType = require('../types/OpeningTime');
const OpeningTimeResolver = require('../resolvers/OpeningTime');
const BaseQuery = require('./BaseQuery');

class OpeningTimeQuery extends BaseQuery {

    constructor() {
        super(OpeningTimeType,OpeningTimeResolver);
    }
    
    massageRoomOpeningTimes() {
        return {
            type: new GraphQLList(OpeningTimeType),
            description: 'This will return all the items present in the database',
            args: {
                massage_room_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter massage room id',
                },
                /*
                surgery_room_id: {
                    type: GraphQLID,
                    description: 'Please enter surgery room id',
                },
                */
                date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter  date',
                }
            },
            resolve(parent, args, context, info) {
                let srch = {};
                if (args.massage_room_id) {
                    srch.massage_room_id=args.massage_room_id
                }
                /*
                if (args.surgery_room_id) {
                    srch.surgery_room_id=args.surgery_room_id
                }
                */
                if (args.date) {
                    srch.begin={"$gte":args.date,"$lt":new Date(args.date.getTime()+ (24 * 60 * 60 * 1000))}
                }
                return OpeningTimeResolver.index(srch);
            }
        }
    }
    
}

module.exports = new OpeningTimeQuery();
