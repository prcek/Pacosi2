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

const MassageRoomType = require('./MassageRoom');
const MassageRoomResolver = require('../resolvers/MassageRoom');
const MassageTypeType = require('./MassageType');
const MassageTypeResolver = require('../resolvers/MassageType');
const ClientType = require('./Client');
const ClientResolver = require('../resolvers/Client');

const PaymentType = require('./Payment');


const MassageOrderType = new GraphQL.GraphQLObjectType({
    name: 'MassageOrder',
    description: 'MassageOrder type for managing all the orders in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the item, Generated automatically by MongoDB',
        },

        massage_room_id: {
            type: GraphQLID,
            description: 'massage room id',
        },
        
        massage_room: {
            type: MassageRoomType,
            description: 'massage room',
            resolve(parent, args, context, info) {
                return MassageRoomResolver.single({ id: parent.massage_room_id });
            }
        },

        massage_room_id: {
            type: GraphQLID,
            description: 'massage room id',
        },
        
        massage_room: {
            type: MassageRoomType,
            description: 'massage room',
            resolve(parent, args, context, info) {
                return MassageRoomResolver.single({ id: parent.massage_room_id });
            }
        },

        massage_type_id: {
            type: GraphQLID,
            description: 'massage type id',
        },
        
        massage_type: {
            type: MassageTypeType,
            description: 'massage type',
            resolve(parent, args, context, info) {
                return MassageTypeResolver.single({ id: parent.massage_type_id });
            }
        },

        begin: {
            type: GraphQLDateTime,
            description: 'Begin time',
        },


        client_id: {
            type: GraphQLID,
            description: 'client id',
        },

        client: {
            type: ClientType,
            description: 'client',
            resolve(parent, args, context, info) {
                return ClientResolver.single({ id: parent.client_id });
            }
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
            description: 'Date and time when this order was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this order was last updated',
        }

    })

});


module.exports = MassageOrderType;
