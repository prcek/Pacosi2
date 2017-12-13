'use strict';

const GraphQL = require('graphql');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = GraphQL;

// lets import our user type
const MassageTypeType = require('../types/MassageType');

// lets import our user resolver
const MassageTypeResolver = require('../resolvers/MassageType');


module.exports = {

    create() {
        return {
            type: MassageTypeType,
            description: 'Add new Massage type',

            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter Massage type name, Cannot be left empty',
                },
                length: {
                    type: new GraphQLNonNull(GraphQLInt),
                    description: 'Enter Massage type length, Cannot be left empty',
                },
                active: {
                    type: GraphQLBoolean,
                    description: 'Enters Massage type status, by default its set to active. true: active, false: disabled',
                },
            },
            resolve(parent, fields) {
                return MassageTypeResolver.create(fields);
            }
        }
    },


    update() {
        return {
            type: MassageTypeType,
            description: 'Update Massage type details',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter Massage type id',
                },
                name: {
                    type: GraphQLString,
                    description: 'Enter Massage type name, Cannot be left empty',
                },
                length: {
                    type: GraphQLInt,
                    description: 'Enter Massage type length, Cannot be left empty',
                },
                active: {
                    type: GraphQLBoolean,
                    description: 'Enters Massage type status. true: active, false: disabled',
                },
            },
            resolve(parent, fields) {
                return MassageTypeResolver.update(fields);
            }

        }
    },


    delete() {
        return {
            type: MassageTypeType,
            description: 'Delete existing Massage type',

            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Enter Massage type id',
                },
            },
            resolve(parent, fields) {
                return MassageTypeResolver.delete(fields);
            }
        }
    },


};