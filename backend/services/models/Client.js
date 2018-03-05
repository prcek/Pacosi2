'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const ClientSchema = mongoose.Schema(
    {

        location_id: {
            type: Schema.Types.ObjectId,
            ref: "Location",
           // required: true
            index:true
        },

        no: {
            type: Number,
            unique: true,
            required: true
        },
        name: {
            type: String,
        },
        surname: {
            type: String,
            required: true
        },
        year: {
            type: Number,
        },
        email: {
            type: String,
            lowercase: true,
        },
        phone: {
            type: String
        },
        comment: {
            type: String
        },
        street: {
            type: String
        },
        city: {
            type: String
        },

        old_id: {
            type: String
        },

        hidden: {
            type: Boolean,
            default: false
        },
        search: {
            name: {type: String, index:true},
            surname: {type: String, index:true}
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'clients',
    }
);


const removeDiacritics = require('diacritics').remove;

function genNo() {
   return Math.floor(Math.random()*128000)*7+100000;
}

function generateNo(model) {
    return new Promise((resolve, reject) => {
        const no = genNo();
        ClientModel.find({no:no}).then(r=>{
            if (r.length == 0) {
                resolve(no);
            } else {
                reject("dupl");
            }
        }).catch(reject);
    });
}

const pRetry = require('p-retry');

ClientSchema.methods.generateNo = function() {
    let me = this;
    return new Promise((resolve, reject) => {
        pRetry(generateNo,{retries: 10,minTimeout:1,maxTimeout:1}).then(no=>{
            me.no=no;
            resolve(no);
        }).catch(reject);
    });
};

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

var ClientModel = mongoose.model( 'Client', ClientSchema );

module.exports = ClientModel;