'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const TestSchema = mongoose.Schema(
    {
        hello: {
            type: String,
            required: true
        },

        world: {
            type: String,
            required: true
        },

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'tests',
    }
);



module.exports = mongoose.model( 'Test', TestSchema );