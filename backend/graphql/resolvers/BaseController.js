'use strict';


class BaseController {
    constructor(model) {
        console.log("BaseController constructor for model",model.modelName)
        this.model = model;
    }

    index() {
        console.log("index",this.model.modelName)
        return this.model.find()
            .sort('created_at')
            .exec()
            .then( records => {
                return records;
            })
            .catch( error => {
                return error;
            });
    }

    single( args ) {
        return new Promise((resolve, reject) => {
            console.log("get",this.model.modelName+"(",args,")")    
            this.model.findOne({ _id: args.id }).then(r=>{
                if (r===null) {
                    console.log("can't find",this.model.modelName,"with id:",args.id)
                }
                resolve(r);
            }).catch(reject);
        });
    }

    create(args) {
        return new Promise((resolve, reject) => {
            console.log("create",this.model.modelName+"(",args,")")   
            const record = new this.model(args);
            record.save().then(r=>{
                if (r===null) {
                    console.log("can't create",this.model.modelName)
                } else {
                    console.log("new",this.model.modelName,"id",r.id)
                }
                resolve(r);
            }).catch(reject);
        });
    }


    update(args) {
        return new Promise((resolve, reject) => {
            console.log("update",this.model.modelName+"(",args,")")
            this.model.findOne({ _id: args.id }).then(r=>{
                if (r === null) {
                    console.log("can't find",this.model.modelName,"with id:",args.id);
                    resolve(null);
                } else {
                    Object.keys(args).map( field => {
                        r[field] = args[field];
                    });
                    r.save().then(u=>{
                        resolve(u);
                    }).catch(reject);
                }
            }).catch(reject);
        });
    }

    delete(args) {
        return new Promise((resolve, reject) => {
            console.log("delete",this.model.modelName+"(",args,")")
            this.model.findByIdAndRemove( args.id ).then(r=>{
                if (r===null) {
                    console.log("can't find",this.model.modelName,"with id:",args.id)
                    
                }
                resolve(r);
            }).catch(reject);
        });
    }



};


module.exports = BaseController;