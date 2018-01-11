'use strict';

const LessonType = require('../../services/models/LessonType');

const BaseController = require('./BaseController');

class LessonTypeController extends BaseController {

    constructor() {
        super(LessonType);
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

const lesson_type_controller = new LessonTypeController();
module.exports = lesson_type_controller;
