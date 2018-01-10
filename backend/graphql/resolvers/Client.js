'use strict';

const Client = require('../../services/models/Client');
const escapeStringRegexp = require('escape-string-regexp');
const removeDiacritics = require('diacritics').remove;

const BaseController = require('./BaseController');


class ClientController extends BaseController{

    constructor() {
        super(Client);
    }

    create(args) {
        return new Promise((resolve, reject) => {
            console.log("ClientController create",this.model.modelName+"(",args,")")   
            const record = new this.model(args);

            
            record.generateNo().then(x=>{
                console.log("record with No",record);
                record.save().then(r=>{
                    if (r===null) {
                        console.log("can't create",this.model.modelName)
                    } else {
                        console.log("new",this.model.modelName,"id",r.id)
                    }
                    resolve(r);
                }).catch(reject);
            }).catch(reject);
        });
    }


    lookup(text,limit=0) {
        console.log("ClientController lookup","["+text+"]",limit)    
        const srchtxt = "^"+escapeStringRegexp(removeDiacritics(text).toLowerCase().trim());
        return this.model.find({ $or: [{'search.surname': {$regex: srchtxt }},{'search.name':{$regex: srchtxt } }]}).limit(limit)
            .sort('created_at')
            .exec()
            .then( records => {
                return records;
            })
            .catch( error => {
                return error;
            });
    }


};

const client_controller = new ClientController();
module.exports = client_controller;
