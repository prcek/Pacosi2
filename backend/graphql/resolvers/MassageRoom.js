'use strict';

const MassageRoom = require('../../services/models/MassageRoom');

const BaseController = require('./BaseController');
const OpeningTimeResolver = require('./OpeningTime');
const MassageOrderResolver = require('./MassageOrder');
const MassageTypeResolver = require('./MassageType');
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
const Lodash =  require('lodash');

const pAll = require('p-all');

class MDController {

    sortByRange(array) {
        return Lodash.sortBy(array,[function(o) { return o.range.toDate()[0]; },function(o) { return o.range.toDate()[1]; }])
    }
    umbrellaRange(array) {
        const begins = array.map((x)=>{return x.range.start.toDate()});
        const ends = array.map((x)=>{return x.range.end.toDate()});
        const begin = Lodash.min(begins);
        const end = Lodash.max(ends);
        if (begin && end) {
            const res =  moment.range(begin,end);
            return res;
        }
        return null;
    }    
    

    updateSlots() {

        this.opening_times_range = this.umbrellaRange(this.opening_times);
        this.massage_orders_range = this.umbrellaRange(this.massage_orders);


        if (this.opening_times_range && this.massage_orders_range) {
            this.slots_range = this.umbrellaRange([{range:this.opening_times_range},{range:this.massage_orders_range}]);
        } else {
            this.slots_range = this.opening_times_range || this.massage_orders_range;
        }

        if (this.slots_range) {
            const slots = Array.from(this.slots_range.by('minutes', { step: 30, exclusive: true })).map(s=>{
                if (this.massage_orders_range) {
                    const r = this.massage_orders.find((r)=>{
                        return s.isSameOrAfter(r.range.start) && s.isBefore(r.range.end);
                    });
                    if (r) {
                        const cont = s.isAfter(r.range.start);
                        return {begin:s.toDate(),type:"o",cont:cont,order:r.massage_order,len:r.massage_len}
                    }
                } 

                if (this.opening_times_range) {
                    const r = this.opening_times.find((r)=>{
                        return s.isSameOrAfter(r.range.start) && s.isBefore(r.range.end);
                    });
                    if (r) {
                        return {begin:s.toDate(),type:"f",opening_time:r,len:30}
                    }
                }

                return {begin:s.toDate(),type:"b",len:30};
            })

            for(let si=1; si<slots.length;si++) {
                if (slots[si].type==="b") {
                    slots[si].cont = (slots[si-1].type==="b");
                }
            }
            var cumb =0;
            for(let si=slots.length-1; si>=0; si--) {
                if (slots[si].type==='b') {
                    if (slots[si].cont) {
                        cumb+=30;
                    } else {
                        slots[si].len = 30+cumb;
                        cumb = 0;
                    }
                }
            }

            this.slots = slots.filter(s=>{
                return !( 
                    (s.type==='b' && s.cont) || 
                    (s.type==='o' && s.cont)
                );
            });
        } else {
            this.slots=[];
        }

    }

    constructor(date,opening_times=[],massage_orders=[],massage_type_dict={}) {
        this.day = moment(date).startOf("day");
        this.day_range = moment.range(this.day,moment(this.day).add(1,"day"));
        this.opening_times = this.sortByRange(opening_times.map(ot=>{
            return {id:ot.id,type:"ot",opening_time:ot,range:moment.range(ot.begin,ot.end)}
        }));
        this.massage_orders = this.sortByRange(massage_orders.map(mo=>{
            const begin = moment(mo.begin).toDate()
            const mt = massage_type_dict[mo.massage_type_id];
            let len = 30;
            if (mt) {
                len = mt.length;
                mo.massage_type=mt;
            } else {
                console.log("can't find massage type",mo.massage_type_id);
            }

            const end = moment(mo.begin).add(len,"minutes").toDate();
            return {id:mo.id,type:"mo",massage_order:mo,massage_len:len,range:moment.range(begin,end)} 
        }));
        this.updateSlots();
    }

    getSlots() {
        return this.slots.map(s=>{
            return {break:s.type==="b",order:s.type==="o"?s.order:null,date:s.begin,len:Math.trunc(s.len/30)}
        })
    }
    getStatus() {
        if (this.slots.length === 0) {
            return 0;
        }
        const f = this.slots.find(s=>{
            return s.type === "f";
        })
        if (f) {
            return 1;
        } 
        return 2;
    }
}




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
            pAll([()=>OpeningTimeResolver.index(srch),()=>MassageOrderResolver.index(srch),()=>MassageTypeResolver.all()]).then(res=>{
                const ots = res[0]
                const mos = res[1]
                const mts = Lodash.keyBy(res[2], 'id') 
                //console.log(mts);

                const mdc = new MDController(args.date,ots,mos,mts);
                const slots =mdc.getSlots();
                const status = mdc.getStatus();
                console.log("SLOTS",slots)
                  
                const plan = {date:args.date,status:ots.length?1:0,opening_times:ots,massage_orders:mos,slots:slots,status:status}
                resolve(plan);
            }).catch(reject)
    

        });

    }

};

const massage_room_controller = new MassageRoomController();
module.exports = massage_room_controller;
