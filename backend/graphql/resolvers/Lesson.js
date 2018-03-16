'use strict';

const Lesson = require('../../services/models/Lesson');
const BaseController = require('./BaseController');
const mongoose = require('mongoose');

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
    report(args) {
        console.log("LessonController report",args)

        return new Promise((resolve, reject) => {
            let srch = {};
            if (args.begin_date && args.end_date) {
                srch.datetime={"$gte":args.begin_date,"$lt":args.end_date}
            }
            let loc_filter = {};
            if (args.location_id) {
                loc_filter =  { "lesson_type.location_id": mongoose.Types.ObjectId(args.location_id)}
            }
            console.log("srch",srch)
            this.model.aggregate([
                { $match: srch },
                { $lookup: {from: "lessontypes", localField:"lesson_type_id", foreignField:"_id", as:"lesson_type"}},
                { $unwind: {path: "$lesson_type"}},
                { $match: loc_filter},
              //  { $match: { "lesson_type.location_id": mongoose.Types.ObjectId(args.location_id)}},
                { $lookup: {from:"lessonmembers", localField:"_id",foreignField:"lesson_id",as:"members"}},
                { $project: { _id:1, lesson_type_id:1, location_id:"$lesson_type.location_id", count:{$size: "$members" } }},
                { $group: {_id: "$lesson_type_id",  count: {$sum: "$count"}, location_id:{$first:"$location_id"}}},
                { $project: { _id:0, lesson_type_id:"$_id", location_id:1, count:1}}
               // { $unwind : { path:"$massage_room_id" , preserveNullAndEmptyArrays:true}},
               // { $lookup: {from: "massagerooms", localField:"massage_room_id", foreignField: "_id", as:"massage_room"}},
               // { $lookup: {from: "massagetypes", localField:"_id", foreignField: "_id", as:"massage_type"}},
               // { $unwind : { path:"$massage_room" , preserveNullAndEmptyArrays:true}},
               // { $unwind : { path:"$massage_type" , preserveNullAndEmptyArrays:true}},
               // { $project: { _id:0, massage_room_id:1 , massage_room: {id:"$massage_room._id", name:"$massage_room.name", location_id:"$massage_room.location_id"}, massage_type:{id:"$massage_type._id",name:"$massage_type.name"}, massage_type_id:"$_id", count:1 }},
            ]).then(res=>{
                console.log(res);
                resolve(res);
            }).catch(reject)

            //resolve([{price:10,count:42}]);
        });
    }

};

const lesson_controller = new LessonController();
module.exports = lesson_controller;
