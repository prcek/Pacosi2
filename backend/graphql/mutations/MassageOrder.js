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

const MassageOrderType = require('../types/MassageOrder');
const MassageOrderResolver = require('../resolvers/MassageOrder');
const BaseMutation = require('./BaseMutation');
const PaymentType = require('../types/Payment');


class MassageOrderMutation extends BaseMutation {
    constructor() {
        super(MassageOrderType,MassageOrderResolver);
    }
    create_args() {
        return {
            massage_room_id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order massage room id, Cannot be left empty',
            },
            massage_type_id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order massage type id, Cannot be left empty',
            },
            begin: {
                type: new GraphQLNonNull(GraphQLDateTime),
                description: 'Enter start time, Cannot be left empty',
            },
            customer_name: {
                type: GraphQLString,
                description: 'Enter order customer name',
            },
            
            payment: {
                type: new GraphQLNonNull(PaymentType),
                description: 'Enters payment type',
            },

            comment: {
                type: GraphQLString,
                description: 'Enter comment',
            },
            
        }
    }
    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter order item id',
            },
            massage_room_id: {
                type: GraphQLID,
                description: 'Enter order massage room id, Cannot be left empty',
            },
            massage_type_id: {
                type: GraphQLID,
                description: 'Enter order massage type id, Cannot be left empty',
            },
            begin: {
                type: GraphQLDateTime,
                description: 'Enter start time, Cannot be left empty',
            },
            customer_name: {
                type: GraphQLString,
                description: 'Enter order customer name',
            },

            payment: {
                type: PaymentType,
                description: 'Enters payment type',
            },

            comment: {
                type: GraphQLString,
                description: 'Enter comment',
            },
        
        };
    }
}


module.exports = new MassageOrderMutation();

   