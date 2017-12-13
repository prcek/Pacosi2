'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

// import the user type we created
const MassageTypeType = require('../types/MassageType');

// import the user resolver we created
const MassageTypeResolver = require('../resolvers/MassageType');


module.exports = {

    index() {
        return {
            type: new GraphQLList(MassageTypeType),
            description: 'This will return all the items present in the database',
            resolve(parent, args, context, info) {
                return MassageTypeResolver.index({});
            }
        }
    },

    single() {
        return {
            type: MassageTypeType,
            description: 'This will return data of a single item based on the id provided',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Please enter item id',
                }
            },
            resolve(parent, args, context, info) {
                return MassageTypeResolver.single({ id: args.id });
            }
        }
    },

};
