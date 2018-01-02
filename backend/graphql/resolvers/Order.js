'use strict';

const Order = require('../../services/models/Order');

const BaseController = require('./BaseController');

class OrderController extends BaseController {

    constructor() {
        super(Order);
    }

};

const order_controller = new OrderController();
module.exports = order_controller;
