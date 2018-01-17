'use strict';

const MassageOrder = require('../../services/models/MassageOrder');

const BaseController = require('./BaseController');

class MassageOrderController extends BaseController {

    constructor() {
        super(MassageOrder);
    }

};

const massage_order_controller = new MassageOrderController();
module.exports = massage_order_controller;
