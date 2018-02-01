'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const LessonMemberSchema = mongoose.Schema(
    {
        lesson_id: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true
        },

        client_id: {
            type: Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },

        presence: {
            type: Boolean,
            default:false
        },

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'lessonmembers',
    }
);



module.exports = mongoose.model( 'LessonMember', LessonMemberSchema );