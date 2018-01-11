'use strict';

const OrderItem = require('../../services/models/OrderItem');

const BaseController = require('./BaseController');

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
        const f = {...filter,...this.hiddenFilter}
        return super.index(f);
    }
    
    count(filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.count(f);
    }

};


const order_item_controller = new OrderItemController();
module.exports = order_item_controller;
