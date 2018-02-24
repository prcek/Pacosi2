'use strict';

const LessonType = require('../../services/models/LessonType');
const LessonResolver = require('./Lesson');
const mongoose = require('mongoose');
const Lodash =  require('lodash');

const BaseController = require('./BaseController');

class LessonTypeController extends BaseController {

    constructor() {
        super(LessonType);
        this.hiddenFilter = {hidden: {$ne: true}}
    }
    index_pages(pagination,filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.index_pages(pagination,f);
    }

    index(filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.index(f);
    }
    
    count(filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.count(f);
    }

    dayInfos(args) {
        console.log("LessonTypeController dayInfos",args)

        return new Promise((resolve, reject) => {

            let srch = {};
            
            if (args.lesson_type_id) {
                srch.lesson_type_id=mongoose.Types.ObjectId(args.lesson_type_id)
            }
            if (args.begin_date && args.end_date) {
                srch.datetime={"$gte":args.begin_date,"$lt":args.end_date}
            }

            LessonResolver.days(srch).then(res=>{
                const infos = Lodash.map(res,function(d){
                    let sts;
                    switch(d.free) {
                        case true: sts=1; break;
                        case false: sts=2; break;
                        default: sts=0;
                    }
                    return {date:d._id,status:sts};
                });
               //console.log(infos);
                resolve(infos)
            })

        
        });
        
    }

};

const lesson_type_controller = new LessonTypeController();
module.exports = lesson_type_controller;
