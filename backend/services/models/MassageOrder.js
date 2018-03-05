'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const MassageOrderSchema = mongoose.Schema(
    {
        massage_room_id: {
            type: Schema.Types.ObjectId,
            ref: "MassageRoom",
            required: true,
            index: true,
        },

        massage_type_id: {
            type: Schema.Types.ObjectId,
            ref: "MassageType",
            required: true
        },
        
        begin: {
            type: Date,
            required: true,
            index: true,
        },

        client_id: {
            type: Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },


        comment: {
            type: String,
        },

        payment: {
            type: Number,
            default: 0,
            required: true
        },

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'massageorders',
    }
);



module.exports = mongoose.model( 'MassageOrder', MassageOrderSchema );