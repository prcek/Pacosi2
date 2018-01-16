'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const MassageRoomType = require('../types/MassageRoom');
const MassageRoomResolver = require('../resolvers/MassageRoom');
const OpeningTimeType = require('../types/OpeningTime');
const OpeningTimeResolver = require('../resolvers/OpeningTime');

const BaseQuery = require('./BaseQuery');

const DayStatusType =  new GraphQL.GraphQLEnumType({
    name: 'DayStatus',
    values: {
        OFF:{value:0},
        FREE:{value:1},
        BUSY:{value:2}
    }
});


const MassageRoomDayInfoType = new GraphQL.GraphQLObjectType({
    name: 'MassageRoomDayInfo',
   

    fields: () => ({
        date: {
            type: GraphQLDate,
        },
        status: {
            type: DayStatusType
        }
    })

});

const MassageRoomDayPlan = new GraphQL.GraphQLObjectType({
    name: 'MassageRoomDayPlan',
   

    fields: () => ({
        date: {
            type: GraphQLDate,
        },
        status: {
            type: DayStatusType
        },
        opening_times: {
            type: new GraphQLList(OpeningTimeType)
        }
    })

});


class MassageRoomQuery extends BaseQuery {

    constructor() {
        super(MassageRoomType,MassageRoomResolver);
    }

    dayInfos() {
        return {
            type: new GraphQLList(MassageRoomDayInfoType),
            description: 'This will return all the items present in the database',
            args: {
                massage_room_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter massage room id',
                },
                begin_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter  begin date',
                },
                end_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter end date',
                }
            },
            resolve(parent, args, context, info) {
                return MassageRoomResolver.dayInfos(args);
            }
        }
    }
    dayPlan() {
        return {
            type: MassageRoomDayPlan,
            description: 'This will return all the items present in the database',
            args: {
                massage_room_id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter massage room id',
                },
                date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter date',
                },
            },
            resolve(parent, args, context, info) {
                return MassageRoomResolver.dayPlan(args);
            }
        }
    }

    openingTimes() {
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

module.exports = new MassageRoomQuery();

