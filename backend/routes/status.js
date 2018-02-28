
var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

var mongoose = require('mongoose');

const filename = path.join(__dirname,'../version.json');
var ver = {};

try {
    var buf = fs.readFileSync(filename, "utf8");
    console.log("version",buf);
    ver = JSON.parse(buf);
} catch (e) {
    console.error("can't read/parse version file", filename, e);
}

router.get('/ping', function(req, res) {
    res.json({
      pong:true
    })
  });
  
router.get('/mongo', function(req, res, next) {
res.json({
    readyState:mongoose.connection.readyState
})
});
  
router.get('/',function(req,res){
    res.json({
        version:ver
    })
});

module.exports = router;
