'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


const MassageTypeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        length: {
            type: Number,
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
        collection: 'massagetypes',
    }
);



module.exports = mongoose.model( 'MassageType', MassageTypeSchema );