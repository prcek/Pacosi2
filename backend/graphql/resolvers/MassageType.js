'use strict';

const MassageType = require('../../services/models/MassageType');

const BaseController = require('./BaseController');

class MassageTypeController extends BaseController {

    constructor() {
        super(MassageType);
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

    all() { 
        return super.index();
    }
    
    count(filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.count(f);
    }

};

const massage_type_controller = new MassageTypeController();
module.exports = massage_type_controller;
