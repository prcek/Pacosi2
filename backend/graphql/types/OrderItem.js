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


const OrderItemType = new GraphQL.GraphQLObjectType({
    name: 'OrderItem',
    description: 'OrderItem type for managing all the items in our application.',

    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID of the item, Generated automatically by MongoDB',
        },
        name: {
            type: GraphQLString,
            description: 'Name of the item',
        },
        active: {
            type: GraphQLBoolean,
            description: 'Status of the item, whether active or disabled',
        },

        created_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this users account was created',
        },
        updated_at: {
            type: GraphQLDateTime,
            description: 'Date and time when this users account was last updated',
        }

    })

});


module.exports = OrderItemType;
