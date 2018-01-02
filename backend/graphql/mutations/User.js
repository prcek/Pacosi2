'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
} = GraphQL;

// lets import our user type
const UserType = require('../types/User');

// lets import our user resolver
const UserResolver = require('../resolvers/User');
const BaseMutation = require('./BaseMutation');


class UserMutation extends BaseMutation {
    constructor() {
        super(UserType,UserResolver);
    }
    create_args() {
        return {
            name: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Enter users full name, Cannot be left empty',
            },
            email: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Enter users email address, Must be valid and unique',
            },
            password: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Enter users password, will be automatically hashed',
            },
            phone: {
                type: GraphQLString,
                description: 'Enter users phone number',
            },
            status: {
                type: GraphQLInt,
                description: 'Enters users status, by default its set to active. 1: active, 2: disabled',
            },
        };
    }
    update_args() {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: 'Enter user id',
            },
            name: {
                type: GraphQLString,
                description: 'Enter users full name, Cannot be left empty',
            },
            email: {
                type: GraphQLString,
                description: 'Enter users email address, Must be valid and unique',
            },
            password: {
                type: GraphQLString,
                description: 'Enter users password, will be automatically hashed',
            },
            phone: {
                type: GraphQLString,
                description: 'Enter users phone number',
            },
            status: {
                type: GraphQLInt,
                description: 'Enters users status. 1: active, 2: disabled',
            },
        };
    }
}


module.exports = new UserMutation();
