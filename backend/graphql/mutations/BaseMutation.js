'use strict';

const GraphQL = require('graphql');
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = GraphQL;

const GraphQLIsoDate = require('graphql-iso-date');
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = GraphQLIsoDate;


class BaseMutation {
    constructor(type,resolver) {
        console.log("BaseMutation constructor for type",type,"and model resolver",resolver.model.modelName);
        this.type = type;
        this.resolver = resolver;
    }


    create() {
        return {
            type: this.type,
            description: 'Create new '+this.type+' record',
            args: this.create_args(),
            resolve: (parent, fields) => {
                return this.resolver.create(fields);
            }
        }
    }

    update() {
        return {
            type: this.type,
            description: 'Update existing '+this.type+' record',
            args: this.update_args(),
            resolve: (parent, fields) => {
                return this.resolver.update(fields);
            }
        }
    }

    
    delete() {
        return {
            type: this.type,
            description: 'Delete existing '+this.type+' record',
            args: { 
                id: {
                    type: new GraphQLNonNull(GraphQLID), 
                    description: 'Enter '+this.type+' id',
                },
            },
            resolve: (parent, args, context, info)=>{
                return this.resolver.delete(args);
            }
        }
    }

    hide() {
        return {
            type: this.type,
            description: 'Hide existing '+this.type+' record',
            args: { 
                id: {
                    type: new GraphQLNonNull(GraphQLID), 
                    description: 'Enter '+this.type+' id',
                },
            },
            resolve: (parent, args, context, info)=>{
                return this.resolver.hide(args);
            }
        }
    }

};


module.exports = BaseMutation;