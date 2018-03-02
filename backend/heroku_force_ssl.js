'use strict';

module.exports = function (req, res, next) {
  var sslUrl;
  if (process.env.FORCE_SSL==="true" && req.headers['x-forwarded-proto'] !== 'https') {
    console.log("ssl redirect!");
    sslUrl = ['https://', req.hostname, req.url].join('');
    return res.redirect(sslUrl);
  }

  return next();
};
