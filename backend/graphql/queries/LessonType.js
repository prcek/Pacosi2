'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const LessonTypeType = require('../types/LessonType');
const LessonTypeResolver = require('../resolvers/LessonType');
const BaseQuery = require('./BaseQuery');

class LessonTypeQuery extends BaseQuery {

    constructor() {
        super(LessonTypeType,LessonTypeResolver);
    }

}

module.exports = new LessonTypeQuery();

