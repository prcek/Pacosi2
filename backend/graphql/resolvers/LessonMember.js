'use strict';

const LessonMember = require('../../services/models/LessonMember');

const BaseController = require('./BaseController');

class LessonMemberController extends BaseController {

    constructor() {
        super(LessonMember);
        this.defaultSort = {created_at: 1}
    }

    report(args) {
        console.log("LessonMemberController report",args)

        return new Promise((resolve, reject) => {
            let srch = {};
           // if (args.massage_room_id) {
           //     srch.massage_room_id=mongoose.Types.ObjectId(args.massage_room_id);
           // }
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


const lesson_member_controller = new LessonMemberController();
module.exports = lesson_member_controller;
