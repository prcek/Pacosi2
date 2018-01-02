'use strict';

const Location = require('../../services/models/Location');
const BaseController = require('./BaseController');

class LocationController extends BaseController {

    constructor() {
        super(Location);
    }

};

const location_controller = new LocationController();
module.exports = location_controller;
