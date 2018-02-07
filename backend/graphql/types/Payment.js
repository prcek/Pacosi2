'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


const PaymentType =  new GraphQL.GraphQLEnumType({
    name: 'Payment',
    //"darkovy poukaz","faktura","neplaceno","placeno"
    values: {
        NOT_PAID:{value:0},
        VOUCHER:{value:1},
        INVOICE:{value:2},
        PAID:{value:3},
    }
});



module.exports = PaymentType;
