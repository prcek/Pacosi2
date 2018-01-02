'use strict';

const MassageType = require('../../services/models/MassageType');

const BaseController = require('./BaseController');

class MassageTypeController extends BaseController {

    constructor() {
        super(MassageType);
    }

};

const massage_type_controller = new MassageTypeController();
module.exports = massage_type_controller;
