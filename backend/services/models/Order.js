'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const OrderSchema = mongoose.Schema(
    {
        order_item_id: {
            type: Schema.Types.ObjectId,
            ref: "OrderItem",
            required: true,
            index:true,
        },

        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index:true,
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
        },

        date: {
            type: Date,
            required: true
        },

        search: {
            customer_name: {type:String,index:true}
        }

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'orders',
    }
);

const removeDiacritics = require('diacritics').remove;


OrderSchema.pre('save', function(next) {
    if ( this.isModified('customer_name') ) {
        if (this.customer_name) {
            this.search.customer_name = removeDiacritics(this.customer_name).toLowerCase().trim();
        } else {
            this.search.customer_name = "";
        }
    } 
    next();
});


module.exports = mongoose.model( 'Order', OrderSchema );