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

        search: {
            name: String,
            surname: String
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'clients',
    }
);

const removeDiacritics = require('diacritics').remove;



ClientSchema.pre('save', function(next) {
    if ( this.isModified('surname') ) {
        if (this.surname) {
            this.search.surname = removeDiacritics(this.surname).toLowerCase().trim();
        } else {
            this.search.surname = "";
        }
    } 
    if ( this.isModified('name') ) {
        if (this.name) {
            this.search.name = removeDiacritics(this.name).toLowerCase().trim();
        } else {
            this.search.name = "";
        }
    } 
    next();
});


module.exports = mongoose.model( 'Client', ClientSchema );