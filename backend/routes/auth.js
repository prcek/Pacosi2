var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const config = require('../config');

const User = require('../services/models/User');


function gen_jwt(dict) {  
  return jwt.sign(dict,config.auth.secret,{expiresIn: '1h'});
}

function genAuthDict(user) {
  var rr = "";
  switch (user.role) {
    case 0: rr = "ADMIN"; break;
    case 1: rr = "RECEPTION"; break;
    case 2: rr = "DOCTOR"; break;
    default: rr= "?";
  }
  return {
    login:user.login,
    auth_ok:true,
    auth_token: gen_jwt({
      user_id:user.id,
      role:rr,
      login:user.login,
    }),
    role:rr,
    name:user.name,
    location_id:user.location_id
  }
}


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
    if (ok) {
      res.json(genAuthDict(r));
    } else {
      res.json({
        auth_ok: false,
      });
    }
  }).catch(err=>{
    console.log("notfound")
    res.json({
      auth_ok: false,
    });
  })


});


router.post('/relogin', function(req, res, next) {
  console.log("DO RELOGIN");
  const token = req.body.token;
  //console.log("token",token)


  jwt.verify(token, config.auth.secret, function(err, decoded) {
    if (err) {
      res.json({
        auth_ok:false
      })
    } else {
      console.log(decoded);
      User.findOne({ _id: decoded.user_id, hidden: {$ne: true}, status:1 }).then(r=>{
        //console.log(r._id);
        res.json(genAuthDict(r));
      }).catch(err=>{
        console.log("notfound")
        res.json({
          auth_ok: false,
        });
      })
    }
   
  });

 
 
});

module.exports = router;
