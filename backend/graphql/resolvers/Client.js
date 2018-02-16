'use strict';

const Client = require('../../services/models/Client');
const escapeStringRegexp = require('escape-string-regexp');
const removeDiacritics = require('diacritics').remove;

const BaseController = require('./BaseController');


class ClientController extends BaseController{


    constructor() {
        super(Client);
        this.hiddenFilter = {hidden: {$ne: true}}
    }

    single_by_old( args ) {
        return new Promise((resolve, reject) => {
            console.log("ClientController get",this.model.modelName+"(",args,")")    
            this.model.findOne({ old_id: args.old_id }).then(r=>{
                if (r===null) {
                    console.log("can't find",this.model.modelName,"with old_id:",args.old_id)
                }
                resolve(r);
            }).catch(reject);
        });
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

    filterString2filter(str) {
        if (!str) {
            return {}
        } else if (str === "") {
            return {}
        } 
        const srchtxt = "^"+escapeStringRegexp(removeDiacritics(str).toLowerCase().trim());
//        console.log(srchtxt);
        return { $or: [{'search.surname': {$regex: srchtxt }},{'search.name':{$regex: srchtxt } },{'phone': {$regex: srchtxt }},{'comment': {$regex: srchtxt }}]}
    }

    location2filter(str) {
        if (!str) {
            return {}
        } else if (str === "") {
            return {}
        } 
        return {'location_id':str};
    }

    index_pages(pagination,filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.index_pages(pagination,f);
    }

    index(filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.index(f);
    }
    
    count(filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.count(f);
    }

    lookup(text,filter,limit=0) {
        console.log("ClientController lookup","["+text+"]",limit)    
        const srchtxt = "^"+escapeStringRegexp(removeDiacritics(""+text).toLowerCase().trim());
        const tf = { ...filter, $or: [{'phone':{$regex: srchtxt}},{'search.surname': {$regex: srchtxt }},{'search.name':{$regex: srchtxt } }],...this.hiddenFilter};
        console.log(tf);
        return this.model.find(tf).limit(limit)
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
