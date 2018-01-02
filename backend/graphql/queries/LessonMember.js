'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const LessonMemberType = require('../types/LessonMember');
const LessonMemberResolver = require('../resolvers/LessonMember');
const BaseQuery = require('./BaseQuery');

class LessonMemberQuery extends BaseQuery {

    constructor() {
        super(LessonMemberType,LessonMemberResolver);
    }

}

module.exports = new LessonMemberQuery();
