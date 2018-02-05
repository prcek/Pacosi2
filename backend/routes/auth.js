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
    console.log("password is",ok);
    res.json({
      login:login,
      auth_ok:ok,
      role:r.role,
    });
  }).catch(err=>{
    console.log("catch")
    res.json({
      login: login,
      auth_ok: false,
    });
  })


});

module.exports = router;
