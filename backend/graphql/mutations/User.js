'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
} = GraphQL;

const UserType = require('../types/User');
const UserRoleType = require('../types/UserRole');
const StatusType = require('../types/Status');
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
            role: {
                type: new GraphQLNonNull(UserRoleType),
                description: 'User role - Admin,Reception,Doctor'
            },
            email: {
                type: GraphQLString,
                description: 'Enter users email address, Must be valid and unique',
            },
            password: {
                type: GraphQLString,
                description: 'Enter users password, will be automatically hashed',
            },
            status: {
                type: new GraphQLNonNull(StatusType),
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
            role: {
                type: UserRoleType,
                description: 'User role - Admin,Reception,Doctor'
            },
            email: {
                type: GraphQLString,
                description: 'Enter users email address, Must be valid and unique',
            },
            password: {
                type: GraphQLString,
                description: 'Enter users password, will be automatically hashed',
            },
            status: {
                type: StatusType,
                description: 'Enters users status. 1: active, 2: disabled',
            },
        };
    }
}


module.exports = new UserMutation();
