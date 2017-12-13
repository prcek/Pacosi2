'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const ClientSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            lowercase: true,
        },
        phone: {
            type: String
        },
        street: {
            type: String
        },
        city: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'clients',
    }
);




module.exports = mongoose.model( 'Client', ClientSchema );