'use strict';

const OpeningTime = require('../../services/models/OpeningTime');
const mongoose = require('mongoose');
const BaseController = require('./BaseController');

class OpeningTimeController extends BaseController {

    constructor() {
        super(OpeningTime);
    }

    days(filter) {
        return new Promise((resolve, reject) => {
            this.model.aggregate([
               {$match: filter},
               {$project: { day:{$dateToString:{format:"%Y-%m-%d",date:"$begin"}}, begin:1, end:1}},
               {$group: { _id:"$day", ots:{ $push: {begin:"$begin",end:"$end"}}}},
               {$sort: {_id:1}}
            ]).then(res=>{
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
        });
    
    }
};

const OpeningTime_controller = new OpeningTimeController();
module.exports = OpeningTime_controller;
