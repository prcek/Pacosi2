'use strict';
const mongoose = require('mongoose');
const Order = require('../../services/models/Order');
const escapeStringRegexp = require('escape-string-regexp');
const removeDiacritics = require('diacritics').remove;

const BaseController = require('./BaseController');

class OrderController extends BaseController {

    constructor() {
        super(Order);
        this.defaultSort = {date: -1}
    }

    index_pages(pagination,filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.index_pages(pagination,f);
    }


    filterString2filter(str) {
        if (!str) {
            return {}
        } else if (str === "") {
            return {}
        } 
        const srchtxt = "^"+escapeStringRegexp(removeDiacritics(str).toLowerCase().trim());
//        console.log(srchtxt);
        return { 'search.customer_name': {$regex: srchtxt }}
    }

    report(args) {
        console.log("OrderController report",args)

        return new Promise((resolve, reject) => {
            let srch = {};
            if (args.user_id) {
                srch.user_id=mongoose.Types.ObjectId(args.user_id);
            }
            if (args.begin_date && args.end_date) {
                srch.date={"$gte":args.begin_date,"$lt":args.end_date}
            }
            console.log("srch",srch)
            this.model.aggregate([
                { $match: srch },
                { $group: {_id: "$order_item_id", user_id: {$addToSet: "$user_id"}, count: {$sum: "$count"}, price: {$sum: "$total_price"}}},
                { $unwind : { path:"$user_id" , preserveNullAndEmptyArrays:true}},
                { $lookup: {from: "users", localField:"user_id", foreignField: "_id", as:"user"}},
                { $lookup: {from: "orderitems", localField:"_id", foreignField: "_id", as:"order_item"}},
                { $unwind : { path:"$user" , preserveNullAndEmptyArrays:true}},
                { $unwind : { path:"$order_item" , preserveNullAndEmptyArrays:true}},
                { $project: { _id:0, user_id:1 , user: {id:"$user._id", name:"$user.name", role:"$user.role", status:"$user.status"}, order_item:{id:"$order_item._id",name:"$order_item.name", status:"$order_item.status"}, order_item_id:"$_id", count:1, price:1 }},
            ]).then(res=>{
//                console.log(res);
                resolve(res);
            }).catch(reject)

            //resolve([{price:10,count:42}]);
        });
    }
};

const order_controller = new OrderController();
module.exports = order_controller;
