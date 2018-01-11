'use strict';

const MassageRoom = require('../../services/models/MassageRoom');

const BaseController = require('./BaseController');

class MassageRoomController extends BaseController {

    constructor() {
        super(MassageRoom);
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

const massage_room_controller = new MassageRoomController();
module.exports = massage_room_controller;
