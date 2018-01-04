const mongoose = require('mongoose');
const config = require('./config');

mongoose.Promise = require('bluebird');
var mongo_options = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useMongoClient: true
};
mongoose.connect( config.database.HOST, mongo_options);

var fs = require("fs");
var contents = fs.readFileSync("MOCK_DATA.json");
var jsonContent = JSON.parse(contents);

const Client = require('./services/models/Client');
const pMap = require('p-map');

pMap(jsonContent,(d)=>{


    return new Promise((resolve, reject) => {
        var c = new Client(d);
        c.generateNo().then(x=>{
            console.log(c);
            c.save();
            resolve(c);
        })
    });
    

},{concurrency: 1}).then((x)=>{
    console.log(x);

})


var c = new Client(jsonContent[0]);
c.generateNo().then(x=>{
    console.log(c);
    //c.save();
})

//console.log(c)