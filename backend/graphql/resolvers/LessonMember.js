'use strict';

const LessonMember = require('../../services/models/LessonMember');

const BaseController = require('./BaseController');

class LessonMemberController extends BaseController {

    constructor() {
        super(LessonMember);
    }

};


const lesson_member_controller = new LessonMemberController();
module.exports = lesson_member_controller;
