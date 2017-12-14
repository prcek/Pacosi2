'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const LessonSchema = mongoose.Schema(
    {
        lesson_type_id: {
            type: Schema.Types.ObjectId,
            ref: "LessonType",
            required: true
        },

        capacity: {
            type: Number,
            required: true
        },

        datetime: {
            type: Date,
            required: true
        },

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'lessons',
    }
);



module.exports = mongoose.model( 'Lesson', LessonSchema );