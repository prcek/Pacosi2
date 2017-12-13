'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


const LessonTypeSchema = mongoose.Schema(
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
        collection: 'lessontypes',
    }
);



module.exports = mongoose.model( 'LessonType', LessonTypeSchema );