'use strict';

const MassageRoom = require('../../services/models/MassageRoom');
const mongoose = require('mongoose');

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
    filterByRange(array,range) {
        return array.filter(x=>{
           const b =  moment(x.begin);
           return b.isSameOrAfter(range.start) && b.isBefore(range.end);
        });
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
            var cumf =0;
            for(let si=slots.length-1; si>=0; si--) {
                if (slots[si].type==='b') {
                    if (slots[si].cont) {
                        cumb+=30;
                    } else {
                        slots[si].len = 30+cumb;
                        cumb = 0;
                    }
                }
                if (slots[si].type==='f') {
                    if ((si<(slots.length-1)) && (slots[si+1].type==='f')) {
                        cumf = slots[si+1].clen + slots[si].len;
                        slots[si].clen = cumf;
                    } else {
                        slots[si].clen = slots[si].len;
                        cumf = slots[si].len
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
        this.opening_times = this.sortByRange(this.filterByRange(opening_times,this.day_range).map(ot=>{
            return {id:ot.id,type:"ot",opening_time:ot,range:moment.range(ot.begin,ot.end)}
        }));
        this.massage_orders = this.sortByRange(this.filterByRange(massage_orders,this.day_range).map(mo=>{
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

            if (s.type === "b") {
                return {break:true,free:false,date:s.begin,len:Math.trunc(s.len/30)};
            } if (s.type === "f") {
                return {break:false,free:true,date:s.begin,len:Math.trunc(s.len/30),clen:Math.trunc(s.clen/30)};
            } if (s.type === "o") {
                return {break:false,free:false,date:s.begin,len:Math.trunc(s.len/30),order:s.order};
            } else {
                return {break:false,free:false,date:s.begin};
            }


            //return {break:s.type==="b",order:s.type==="o"?s.order:null,date:s.begin,len:Math.trunc(s.len/30)}
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
function range2slots(b,e) {
    const range = moment.range(b,e);
    const slots = Array.from(range.by('minutes',{exclusive: true,step:30}));
    return Lodash.map(slots,function(s){return s.toISOString()});
}

function range2len(b,e) {
    const range = moment.range(b,e);
    const slots = Array.from(range.by('minutes',{exclusive: true,step:30}));
    return slots.length;
}


function calc_new_status(ots,mos) {

    if (mos == null && ots == null) {
      return { status:0, slots:[] } //OFF
    }

    const otslotsX = ots?Lodash.flatten(Lodash.map(ots,function(ot){
        return range2slots(ot.begin,ot.end).map(s=>{return{date:s,free:true}})
    })):[];

    const moslotsX = mos?Lodash.flatten(Lodash.map(mos,function(mo){
        const end = moment(mo.begin).add(mo.len,"minutes");
        return range2slots(mo.begin,end).map((s,idx)=>{return {date:s,busy:true,id:mo._id,len:mo.len,first:idx===0}})
    })):[];

   
    const slotsG = Lodash.groupBy(moslotsX.concat(otslotsX),'date');

    const allSlots = Lodash.sortBy(Lodash.toPairs(slotsG).map(s=>{
        const free = Lodash.filter(s[1],{'free':true});
        const busy = Lodash.filter(s[1],{'busy':true});
        if (busy.length>0) {
            return {date:s[0],orders:busy.map(b=>{return {id:b.id,first:b.first,len:Math.floor(b.len/30)}})};
        } else {
            return {date:s[0],order:null,len:1,free:true,break:false};
        } 
    }),function(o){return o.date});


    const dates = allSlots.map(s=>{return s.date});
    const gaps = Lodash.compact(Lodash.zip(Lodash.slice(dates,0,dates.length-1),Lodash.slice(dates,1)).map(p=>{
        const r = range2len(p[0],p[1]);
        if (r>1) {
            const d = moment(p[0]).add(30,"minutes").toISOString(); 
            return {date:d,break:true,free:false,len:r-1};
        } else {
            return null;
        }
    }));

    const allSlotsWithGaps = Lodash.sortBy(allSlots.concat(gaps),function(s){return s.date});

    const finalSlots = Lodash.compact(Lodash.flatten(allSlotsWithGaps.map(s=>{
        if (s.orders) {
            const cont_orders = Lodash.filter(s.orders,{'first':false});
            const beg_orders = Lodash.filter(s.orders,{'first':true});
            if (beg_orders.length===0) {
                return null;
            } else {
                const warn = (beg_orders.length>1) || cont_orders.length>0;
                return beg_orders.map((o,idx)=>{
                    const order = Lodash.find(mos,{'id':o.id});
                    return {date:s.date,free:false,break:false,order:order,order_id:o.id,len:o.len,warn:warn};
                })
            }
        } else {
            return s;
        }
    })));

   

    if (Lodash.find(finalSlots,{'warn':true})) {
        return  { status:3, slots:finalSlots }; //PROBLEM
    }

    if (Lodash.find(finalSlots,{'free':true})) {
        return  { status:1, slots:finalSlots }; //FREE
    }
   
    return  { status:2, slots:finalSlots }; //BUSY
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
                srch.massage_room_id=mongoose.Types.ObjectId(args.massage_room_id)
            }
            if (args.begin_date && args.end_date) {
                srch.begin={"$gte":args.begin_date,"$lt":args.end_date}
            }


            pAll([()=>OpeningTimeResolver.days(srch),()=>MassageOrderResolver.days(srch)]).then(res=>{

                const ot_days = res[0];
                const mo_days = res[1];
              
                const xdays = Lodash.sortedUniq(Lodash.concat(Lodash.map(ot_days,"_id"),Lodash.map(mo_days,"_id")));
                const sdays = Lodash.map(xdays,function(day){
                    const cot = Lodash.find(ot_days,{_id:day});
                    const cmo = Lodash.find(mo_days,{_id:day});
                    const sts = calc_new_status(cot?cot.ots:null,cmo?cmo.mos:null);
                    return {date:day,status:sts.status};
                })
                resolve(sdays);
            }).catch(reject)


        });

    }
    dayPlan(args) {

        return new Promise((resolve, reject) => {

            let srch = {};
            if (args.massage_room_id) {
                srch.massage_room_id=mongoose.Types.ObjectId(args.massage_room_id);
            }
            if (args.date ) {
                srch.begin={"$gte":args.date,"$lt":moment(args.date).add(1,'day').toDate()}
            }
            pAll([()=>OpeningTimeResolver.index(srch),()=>MassageOrderResolver.day(srch),()=>MassageTypeResolver.all()]).then(res=>{
                const ots = res[0]
                const mos = res[1]
                const mts = Lodash.keyBy(res[2], 'id') 
                //console.log(mts);


                const sts = calc_new_status(ots,mos);

                //const mdc = new MDController(args.date,ots,mos,mts);
                //const slots =mdc.getSlots();
               // const status = mdc.getStatus();
                //console.log("SLOTS",slots);
                //console.log("NEW SLOTS",sts.slots);
                  
                const plan = {date:args.date,opening_times:ots,massage_orders:mos,slots:sts.slots,status:sts.status}
                resolve(plan);
            }).catch(reject)
    

        });

    }

};

const massage_room_controller = new MassageRoomController();
module.exports = massage_room_controller;
