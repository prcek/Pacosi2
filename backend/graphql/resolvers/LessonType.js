'use strict';

const LessonType = require('../../services/models/LessonType');

const BaseController = require('./BaseController');

class LessonTypeController extends BaseController {

    constructor() {
        super(LessonType);
    }

};

const lesson_type_controller = new LessonTypeController();
module.exports = lesson_type_controller;
