'use strict';

const OpeningTime = require('../../services/models/OpeningTime');
const mongoose = require('mongoose');
const BaseController = require('./BaseController');
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
const Lodash =  require('lodash');


class OpeningTimeController extends BaseController {

    constructor() {
        super(OpeningTime);
    }

    create_multi(massage_room_id,openingtimes) {
        return new Promise((resolve, reject) => { 
            console.log("OpeningTimeController create_multi(",massage_room_id,openingtimes,")");
            let Model = this.model;
            const models = openingtimes.map(ot=>{
                return new Model({massage_room_id:massage_room_id,begin:ot.begin,end:ot.end});
            })
            console.log(models);
            this.model.collection.insert(models).then(r=>{
                if (r===null) {
                    console.log("can't create",Model.modelName)
                } else {
                    console.log("new",Model.modelName,"ids",r.insertedIds)
                    resolve(models);
                }
            })
        });
    }

    clean_days(massage_room_id, dates) {
        console.log("OpeningTimeController clean_days(",massage_room_id,dates,")");
        if (dates.length===0) {
            return [];
        }
        const days = dates.map(d=>{return moment(d).format("YYYY-MM-DD")}).sort();
        const firstday = moment(Lodash.first(days)).toDate();
        const lastday = moment(Lodash.last(days)).add(1,"day").toDate();
        const filter = {
            massage_room_id: mongoose.Types.ObjectId(massage_room_id),
            begin: {"$gte":firstday,"$lt":lastday}
        };

        console.log(filter,days);
        return new Promise((resolve, reject) => {
            const MM = this.model;
            this.model.aggregate([
                {$match: filter},
                {$project: { id:"$_id", massage_room_id:1, day:{$dateToString:{format:"%Y-%m-%d",date:"$begin"}}, begin:1, end:1}},
                {$match: { day: {$in:days}}}
             ]).then(ots=>{
                 //console.log(ots);
                 const ids = ots.map(o=>{return o._id});
                 //console.log("to del",ids);
                 MM.deleteMany({_id: { $in: ids}}).then(res=>{
                     //console.log(res);
                     resolve(ots);
                 }).catch(err=>{
                     reject(err);
                 })
                // resolve([]);
             }).catch(err=>{
                 reject(err);
             })
        });
    }

    days(filter) {
        console.log("OpeningTimeController days (",filter,")")   
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
