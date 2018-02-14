'use strict';

const Location = require('../../services/models/Location');
const BaseController = require('./BaseController');

class LocationController extends BaseController {

    constructor() {
        super(Location);
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

const location_controller = new LocationController();
module.exports = location_controller;
