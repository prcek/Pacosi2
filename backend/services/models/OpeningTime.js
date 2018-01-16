'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;


const OpeningTimeSchema = mongoose.Schema(
    {
        
        massage_room_id: {
            type: Schema.Types.ObjectId,
            ref: "MassageRoom",
        },
/*
        surgery_room_id: {
            type: Schema.Types.ObjectId,
            ref: "SurgeryRoom",
        },
*/
        begin: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
       
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'openingtimes',
    }
);



module.exports = mongoose.model( 'OpeningTime', OpeningTimeSchema );