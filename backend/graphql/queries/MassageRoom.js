'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

// import the user type we created
const MassageRoomType = require('../types/MassageRoom');

// import the user resolver we created
const MassageRoomResolver = require('../resolvers/MassageRoom');


module.exports = {

    index() {
        return {
            type: new GraphQLList(MassageRoomType),
            description: 'This will return all the items present in the database',
            resolve(parent, args, context, info) {
                return MassageRoomResolver.index({});
            }
        }
    },

    single() {
        return {
            type: MassageRoomType,
            description: 'This will return data of a single item based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter item id',
                }
            },
            resolve(parent, args, context, info) {
                return MassageRoomResolver.single({ id: args.id });
            }
        }
    },

};
