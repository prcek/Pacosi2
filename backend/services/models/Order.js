'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const OrderSchema = mongoose.Schema(
    {
        order_item_id: {
            type: Schema.Types.ObjectId,
            ref: "OrderItem",
            required: true
        },

        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        total_price: {
            type: Number,
            required: true
        },

        count: {
            type: Number,
            required: true
        },

        customer_name: {
            type: String,
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'orders',
    }
);



module.exports = mongoose.model( 'Order', OrderSchema );