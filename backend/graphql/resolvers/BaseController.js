'use strict';


class BaseController {
    constructor(model) {
        console.log("BaseController constructor for model",model.modelName)
        this.model = model;
    }

    

    index(filter={}) {
        console.log("BaseController index",this.model.modelName+"(",filter,")")
        return this.model.find(filter)
            .sort('created_at')
            .exec()
            .then( records => {
                return records;
            })
            .catch( error => {
                return error;
            });
    }

    index_pages(pagination,filter={}) {
        console.log("BaseController index pages",this.model.modelName,pagination,filter)
        if (pagination.pageNo<0) {
            pagination.pageNo = 0;
        }
        if (pagination.pageLength<1) {
            pagination.pageLength = 10;
        }


        const offset = pagination.pageLength*pagination.pageNo;
        const limit = pagination.pageLength;

        return new Promise((resolve, reject) => {
            this.model.find(filter).count().then(c=>{
                const rem = c%pagination.pageLength;
                const tp = (((c - rem) / pagination.pageLength))+(rem?1:0);

                this.model.find(filter).sort('created_at').skip(offset).limit(limit).then(records=>{
                    resolve({items:records,paginationInfo:{pageNo:pagination.pageNo,pageLength:pagination.pageLength,totalCount:c,totalPages:tp}});
                }).catch(reject)


            }).catch(reject);
        });

    }
   /* 
    search(filter) {
        return this.index(filter);
    }
  */
    count(filter={}) {
        console.log("BaseController count",this.model.modelName+"(",filter,")")        
        return this.model.find(filter).count()
            .exec()
            .then( count => {
                return count;
            })
            .catch( error => {
                return error;
            });
    }


    single( args ) {
        return new Promise((resolve, reject) => {
            console.log("BaseController get",this.model.modelName+"(",args,")")    
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
            console.log("BaseController create",this.model.modelName+"(",args,")")   
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
            console.log("BaseController update",this.model.modelName+"(",args,")")
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
            console.log("BaseController delete",this.model.modelName+"(",args,")")
            this.model.findByIdAndRemove( args.id ).then(r=>{
                if (r===null) {
                    console.log("can't find",this.model.modelName,"with id:",args.id)
                    
                }
                resolve(r);
            }).catch(reject);
        });
    }

    hide(args) {
        return new Promise((resolve, reject) => {
            console.log("BaseController hide",this.model.modelName+"(",args,")")
            this.model.findOne({ _id: args.id }).then(r=>{
                if (r === null) {
                    console.log("can't find",this.model.modelName,"with id:",args.id);
                    resolve(null);
                } else {
                    r["hidden"] = true;
                    r.save().then(u=>{
                        resolve(u);
                    }).catch(reject);
                }
            }).catch(reject);
        });
    }


};


module.exports = BaseController;