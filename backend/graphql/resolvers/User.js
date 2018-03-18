'use strict';

const User = require('../../services/models/User');

const BaseController = require('./BaseController');
const pAll = require('p-all');


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

        console.log("UserController index",filter)
        const f = {...filter,...this.hiddenFilter}
        const items = ()=>super.index(f);
        const order = ()=>this.fetchOrdering("users");
        const me=this;
        return new Promise(function(resolve,reject){
            pAll([items,order]).then(r=>{
              //  console.log(r[0]);
                resolve(me.applyOrder(r[0],r[1]));
            })


        });

    }
    
    count(filter={}) { 
        const f = {...filter,...this.hiddenFilter}
        return super.count(f);
    }
    save_ordering(args) {
        return super.saveOrdering("users",args.ids);
    }

};

const user_controller = new UserController();
module.exports = user_controller;
