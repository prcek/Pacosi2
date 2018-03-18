'use strict';

const OrderItem = require('../../services/models/OrderItem');

const BaseController = require('./BaseController');
const pAll = require('p-all');

class OrderItemController extends BaseController {

    constructor() {
        super(OrderItem);
        this.hiddenFilter = {hidden: {$ne: true}}
    }
    index_pages(pagination,filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.index_pages(pagination,f);
    }

    index(filter={}) { 

        console.log("OrderItemController index",filter)
        const f = {...filter,...this.hiddenFilter}
        const items = ()=>super.index(f);
        const order = ()=>this.fetchOrdering("orderItems");
        const me=this;
        return new Promise(function(resolve,reject){
            pAll([items,order]).then(r=>{
              //  console.log(r[0]);
                resolve(me.applyOrder(r[0],r[1]));
            })


        });

    }
    
    count(filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.count(f);
    }
    save_ordering(args) {
        return super.saveOrdering("orderItems",args.ids);
    }

};


const order_item_controller = new OrderItemController();
module.exports = order_item_controller;
