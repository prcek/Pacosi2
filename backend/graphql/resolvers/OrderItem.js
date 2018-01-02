'use strict';

const OrderItem = require('../../services/models/OrderItem');

const BaseController = require('./BaseController');

class OrderItemController extends BaseController {

    constructor() {
        super(OrderItem);
    }

};


const order_item_controller = new OrderItemController();
module.exports = order_item_controller;
