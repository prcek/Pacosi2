'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


const LocationSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'locations',
    }
);



module.exports = mongoose.model( 'Location', LocationSchema );