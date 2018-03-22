'use strict';

const MassageOrder = require('../../services/models/MassageOrder');
const mongoose = require('mongoose');

const BaseController = require('./BaseController');

class MassageOrderController extends BaseController {

    constructor() {
        super(MassageOrder);
    }

    day(filter) {
        return new Promise((resolve, reject) => {
            this.model.aggregate([
               {$match: filter},
               {$lookup: {from:"massagetypes", localField:"massage_type_id",foreignField:"_id",as:"mt"}},
               {$unwind: "$mt"},
               { $addFields: { len:"$mt.length" } },
               { $addFields: { id:"$_id" } },
               {$project: { mt:0}},
               {$sort: {begin:1}},
            ]).then(res=>{
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
        });
    }

    days(filter) {
        return new Promise((resolve, reject) => {
            this.model.aggregate([
               {$match: filter},
               {$project: { day:{$dateToString:{format:"%Y-%m-%d",date:"$begin"}}, begin:1,massage_type_id:1}},
               {$lookup: {from:"massagetypes", localField:"massage_type_id",foreignField:"_id",as:"mt"}},
               {$unwind: "$mt"},
               {$project: { day:1,begin:1,len:"$mt.length"}},
               {$sort: {begin:1}},
               {$group: { _id:"$day", mos:{ $push: {begin:"$begin",len:"$len",_id:"$_id"}}}},
               {$sort: {_id:1}}
            ]).then(res=>{
                //console.log(res[0]);
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
        });
    
    }

    report(args) {
        console.log("MassageOrderController report",args)

        return new Promise((resolve, reject) => {
            let srch = {};
            if (args.massage_room_id) {
                srch.massage_room_id=mongoose.Types.ObjectId(args.massage_room_id);
            }
            if (args.begin_date && args.end_date) {
                srch.begin={"$gte":args.begin_date,"$lt":args.end_date}
            }
            console.log("srch",srch)
            this.model.aggregate([
                { $match: srch },
                { $group: {_id: "$massage_type_id", massage_room_id: {$addToSet: "$massage_room_id"}, count: {$sum: 1}}},
                { $unwind : { path:"$massage_room_id" , preserveNullAndEmptyArrays:true}},
                { $lookup: {from: "massagerooms", localField:"massage_room_id", foreignField: "_id", as:"massage_room"}},
                { $lookup: {from: "massagetypes", localField:"_id", foreignField: "_id", as:"massage_type"}},
                { $unwind : { path:"$massage_room" , preserveNullAndEmptyArrays:true}},
                { $unwind : { path:"$massage_type" , preserveNullAndEmptyArrays:true}},
                { $project: { _id:0, massage_room_id:1 , massage_room: {id:"$massage_room._id", name:"$massage_room.name", location_id:"$massage_room.location_id"}, massage_type:{id:"$massage_type._id",name:"$massage_type.name"}, massage_type_id:"$_id", count:1 }},
            ]).then(res=>{
                console.log(res);
                resolve(res);
            }).catch(reject)

            //resolve([{price:10,count:42}]);
        });
    }


};

const massage_order_controller = new MassageOrderController();
module.exports = massage_order_controller;
