var express = require('express');
var router = express.Router();

const User = require('../services/models/User');


/* login. */
router.post('/login', function(req, res, next) {
  console.log("DO LOGIN");
  //console.log(req.body);
  const login = req.body.login;
  const password = req.body.password;
  console.log("DO LOGIN",login);
  User.findOne({ login: login, hidden: {$ne: true}, status:1 }).then(r=>{
    console.log(r);
    const ok = r.comparePassword(password);
    console.log("password ok",ok);
    var rr = "";
    switch (r.role) {
      case 0: rr = "ADMIN"; break;
      case 1: rr = "RECEPTION"; break;
      case 2: rr = "DOCTOR"; break;
      default: rr= "?";
    }
    if (ok) {
      res.json({
        login:login,
        auth_ok:true,
        role:rr,
        name:r.name,
      });
    } else {
      res.json({
        auth_ok: false,
      });
    }
  }).catch(err=>{
    console.log("catch")
    res.json({
      auth_ok: false,
    });
  })


});

module.exports = router;
