'use strict';

const Lesson = require('../../services/models/Lesson');
const BaseController = require('./BaseController');

class LessonController extends BaseController {

    constructor() {
        super(Lesson);
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
