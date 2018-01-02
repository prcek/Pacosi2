'use strict';

const Lesson = require('../../services/models/Lesson');
const BaseController = require('./BaseController');

class LessonController extends BaseController {

    constructor() {
        super(Lesson);
    }

};

const lesson_controller = new LessonController();
module.exports = lesson_controller;
