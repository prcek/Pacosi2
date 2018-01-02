'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const MassageRoomType = require('../types/MassageRoom');
const MassageRoomResolver = require('../resolvers/MassageRoom');
const BaseQuery = require('./BaseQuery');

class MassageRoomQuery extends BaseQuery {

    constructor() {
        super(MassageRoomType,MassageRoomResolver);
    }

}

module.exports = new MassageRoomQuery();

