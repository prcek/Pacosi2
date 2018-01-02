'use strict';

const MassageRoom = require('../../services/models/MassageRoom');

const BaseController = require('./BaseController');

class MassageRoomController extends BaseController {

    constructor() {
        super(MassageRoom);
    }

};

const massage_room_controller = new MassageRoomController();
module.exports = massage_room_controller;
