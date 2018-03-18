'use strict';

const MassageType = require('../../services/models/MassageType');

const BaseController = require('./BaseController');
const pAll = require('p-all');

class MassageTypeController extends BaseController {

    constructor() {
        super(MassageType);
        this.hiddenFilter = {hidden: {$ne: true}}
    }
    index_pages(pagination,filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.index_pages(pagination,f);
    }

    index(filter={}) { 
        console.log("MassageTypeController index",filter)
        const f = {...filter,...this.hiddenFilter}
        const items = ()=>super.index(f);
        const order = ()=>this.fetchOrdering("massageTypes");
        const me=this;
        return new Promise(function(resolve,reject){
            pAll([items,order]).then(r=>{
              //  console.log(r[0]);
                resolve(me.applyOrder(r[0],r[1]));
            })


        });
       

    }

    all() { 
        return super.index();
    }
    
    count(filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.count(f);
    }

    save_ordering(args) {
        return super.saveOrdering("massageTypes",args.ids);
    }

};

const massage_type_controller = new MassageTypeController();
module.exports = massage_type_controller;
