'use strict';

const MassageRoom = require('../../services/models/MassageRoom');

const BaseController = require('./BaseController');
const OpeningTimeResolver = require('./OpeningTime');
const MassageOrderResolver = require('./MassageOrder');
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const pAll = require('p-all');

class MassageRoomController extends BaseController {

    constructor() {
        super(MassageRoom);
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

        return new Promise((resolve, reject) => {

            let srch = {};
            if (args.massage_room_id) {
                srch.massage_room_id=args.massage_room_id
            }
            if (args.begin_date && args.end_date) {
                srch.begin={"$gte":args.begin_date,"$lt":args.end_date}
            }


            pAll([()=>OpeningTimeResolver.index(srch),()=>MassageOrderResolver.index(srch)]).then(res=>{
                const ots = res[0];
                //TODO busy  const mos = res[1]
                const range = moment.range(args.begin_date,args.end_date);
                const days = Array.from(range.by('day'));
                const infos = days.map(d=>{

                    const has_ot = ots.find(ot=>{
                        return d.isSame(moment(ot.begin),'day')
                    });
                    var status = 0;
                    if (has_ot) {
                        status = 1;
                    } 

                    return {date:d.toDate(),status:status};
                })
                resolve(infos);
            }).catch(reject)


        });

    }
    dayPlan(args) {

        return new Promise((resolve, reject) => {

            let srch = {};
            if (args.massage_room_id) {
                srch.massage_room_id=args.massage_room_id
            }
            if (args.date ) {
                srch.begin={"$gte":args.date,"$lt":moment(args.date).add(1,'day').toDate()}
            }
            pAll([()=>OpeningTimeResolver.index(srch),()=>MassageOrderResolver.index(srch)]).then(res=>{
                const ots = res[0]
                const mos = res[1]
                const plan = {date:args.date,status:ots.length?1:0,opening_times:ots,massage_orders:mos}
                resolve(plan);
            }).catch(reject)
    

        });

    }

};

const massage_room_controller = new MassageRoomController();
module.exports = massage_room_controller;
