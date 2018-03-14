'use strict';

const Lesson = require('../../services/models/Lesson');
const BaseController = require('./BaseController');

class LessonController extends BaseController {

    constructor() {
        super(Lesson);
        this.defaultSort = {datetime:1}
    }

    multi_create(args) {
        return new Promise((resolve, reject) => {
            console.log("LessonController multi_create",this.model.modelName+"(",args,")")   
            let model = this.model;
            const models = args.datetimes.map(dt=>{
                return new model({capacity:args.capacity,datetime:dt,lesson_type_id:args.lesson_type_id});
            })
            console.log(models);
            this.model.collection.insert(models).then(r=>{
                if (r===null) {
                    console.log("can't create",this.model.modelName)
                } else {
                    console.log("new",this.model.modelName,"ids",r.insertedIds)
                    resolve(models);
                }
            })
            
            /*

            const record = new this.model(args);
            record.save().then(r=>{
                if (r===null) {
                    console.log("can't create",this.model.modelName)
                } else {
                    console.log("new",this.model.modelName,"id",r.id)
                }
                resolve(r);
            }).catch(reject);

            */

        });
    }

    days(filter) {
        return new Promise((resolve, reject) => {
            this.model.aggregate([
               {$match: filter},
               {$lookup: {from:"lessonmembers", localField:"_id",foreignField:"lesson_id",as:"members"}},
               {$project: { day:{$dateToString:{format:"%Y-%m-%d",date:"$datetime"}}, free:{$gt:["$capacity",{$size: "$members" }]}}},
               {$group: { _id:"$day", frees:{ $push: "$free"}}},
               {$project: { _id:1,free:{$in:[true,"$frees"]}}},
               {$sort: {_id:1}}
            ]).then(res=>{
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
        });
    
    }

};

const lesson_controller = new LessonController();
module.exports = lesson_controller;
