'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;


const LessonTypeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        location_id: {
            type: Schema.Types.ObjectId,
            ref: "Location",
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