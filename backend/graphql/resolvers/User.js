'use strict';

const User = require('../../services/models/User');

const BaseController = require('./BaseController');

class UserController extends BaseController {

    constructor() {
        super(User);
    }

};

const user_controller = new UserController();
module.exports = user_controller;
