'use strict';

const Client = require('../../services/models/Client');
const escapeStringRegexp = require('escape-string-regexp');
const removeDiacritics = require('diacritics').remove;

const BaseController = require('./BaseController');


class ClientController extends BaseController{

    constructor() {
        super(Client);
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
