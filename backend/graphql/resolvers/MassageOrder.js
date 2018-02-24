'use strict';

const MassageOrder = require('../../services/models/MassageOrder');

const BaseController = require('./BaseController');

class MassageOrderController extends BaseController {

    constructor() {
        super(MassageOrder);
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
               {$group: { _id:"$day", mos:{ $push: {begin:"$begin",len:"$len"}}}},
               {$sort: {_id:1}}
            ]).then(res=>{
                //console.log(res[0]);
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
        });
    
    }

};

const massage_order_controller = new MassageOrderController();
module.exports = massage_order_controller;
