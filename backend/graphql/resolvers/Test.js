'use strict';

const Test = require('../../services/models/Test');
const BaseController = require('./BaseController');



class TestController extends BaseController {

    constructor() {
        super(Test);
    }

    hi(args) {
        return new Promise((resolve, reject) => {

            console.log("hi",args)
            setTimeout(function(){
                resolve({hello:"hi!",world:"hoa!!!!"})
            }, 200);

            
        });
    }


    
}


const test_controller = new TestController();
module.exports = test_controller;
