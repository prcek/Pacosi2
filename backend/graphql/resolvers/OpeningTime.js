'use strict';

const OpeningTime = require('../../services/models/OpeningTime');

const BaseController = require('./BaseController');

class OpeningTimeController extends BaseController {

    constructor() {
        super(OpeningTime);
    }

};

const OpeningTime_controller = new OpeningTimeController();
module.exports = OpeningTime_controller;
