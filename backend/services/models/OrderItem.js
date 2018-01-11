'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


const OrderItemSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        hidden: {
            type: Boolean,
            default: false
        },
        status: {
            type: Number,
            default: 1,
            required: true
        },

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'orderitems',
    }
);



module.exports = mongoose.model( 'OrderItem', OrderItemSchema );