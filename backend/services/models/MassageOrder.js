'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const MassageOrderSchema = mongoose.Schema(
    {
        massage_room_id: {
            type: Schema.Types.ObjectId,
            ref: "MassageRoom",
            required: true
        },

        massage_type_id: {
            type: Schema.Types.ObjectId,
            ref: "MassageType",
            required: true
        },
        
        begin: {
            type: Date,
            required: true
        },


        customer_name: {
            type: String,
        },

        comment: {
            type: String,
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'massageorders',
    }
);



module.exports = mongoose.model( 'MassageOrder', MassageOrderSchema );