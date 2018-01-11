'use strict';

const User = require('../../services/models/User');

const BaseController = require('./BaseController');

class UserController extends BaseController {

    constructor() {
        super(User);
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

const user_controller = new UserController();
module.exports = user_controller;
