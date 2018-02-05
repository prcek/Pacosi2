var express = require('express');
var router = express.Router();

/* login. */
router.post('/login', function(req, res, next) {
  console.log("DO LOGIN");
  console.log(req.body);
  
  res.json({
  	id: 1,
    login: req.body.login,
    role: "xx",
    auth: "xx",
    auth_ok: req.body.password=="nimda",
  });
});

module.exports = router;
