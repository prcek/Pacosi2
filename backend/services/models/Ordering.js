'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');



const OrderingSchema = mongoose.Schema(
    {
        _id: { 
            type:String,
            required: true
        },
        ids: [mongoose.Schema.Types.ObjectId]
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'orderings',
    }
);



module.exports = mongoose.model( 'Ordering', OrderingSchema );