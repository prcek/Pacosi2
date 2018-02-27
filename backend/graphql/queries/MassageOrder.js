'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInt
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;

const MassageOrderType = require('../types/MassageOrder');
const MassageOrderResolver = require('../resolvers/MassageOrder');
const BaseQuery = require('./BaseQuery');
const MassageRoomType = require('../types/MassageRoom');
const MassageTypeType = require('../types/MassageType');


const MassageOrderReportType = new GraphQL.GraphQLObjectType({
    name: 'MassageOrderReport',
   

    fields: () => ({
        massage_room_id: {
            type: GraphQLID,
        },
        massage_room: {
            type: MassageRoomType
        },
        massage_type_id: {
            type: GraphQLID,
        },
        massage_type: {
            type: MassageTypeType
        },
        count: {
            type: GraphQLInt,
        },
    })

});


class MassageOrderQuery extends BaseQuery {

    constructor() {
        super(MassageOrderType,MassageOrderResolver);
    }

    report() {
        return {
            type: new GraphQLList(MassageOrderReportType),
            args: {
                massage_room_id: {
                    type: new GraphQLNonNull(GraphQLID),
                },
                begin_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter begin date',
                },
                end_date: {
                    type: new GraphQLNonNull(GraphQLDate),
                    description: 'Please enter end date',
                }
            },
            resolve(parent, args, context, info) {
                return MassageOrderResolver.report(args)
            }

        }
    }

}

module.exports = new MassageOrderQuery();
