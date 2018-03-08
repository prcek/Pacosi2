var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var robots = require('express-robots-txt');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
const config = require('./config');

var qraphql_se = require('graphql-server-express');
const GraphQLSchema = require('./graphql');

//var index = require('./routes/index');
var auth_route = require('./routes/auth');
var status_route = require('./routes/status');
var force_ssl = require('./heroku_force_ssl');
var app = express();


var Raven = require('raven');
const SentryOn = (config.sentry.DSN && config.sentry.DSN!=='');
if (SentryOn) {
  console.log("Sentry is ON");
  Raven.config(config.sentry.DSN).install();
} else {
  console.log("Sentry is OFF");
}

/*
try {
  throw new Error('Broke!');
} catch (e) {
  Raven.captureException(e);
}
*/
if (SentryOn) {
  app.use(Raven.requestHandler());
  app.use(Raven.errorHandler());
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



app.use(logger('dev'));
app.use(force_ssl);
//app.use('/', index);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(robots({UserAgent: '*', Disallow: '/'}));

app.use('/auth',auth_route);
app.use('/status',status_route);

app.use(
  '/graphiql',
  qraphql_se.graphiqlExpress({
    endpointURL: '/graphql'
  })
);

app.use('/graphql',jwt({
  secret: config.auth.secret,
  requestProperty: 'auth',
  getToken: function (req) {
    //console.log(req);
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.cookies && req.cookies.auth) {
      return req.cookies.auth;
    }
    return null;
    //return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWEzYmRmMTQ3YjkzMDI2MmY0YmY4YjdlIiwicm9sZSI6IlJFQ0VQVElPTiIsIm5hbWUiOiJFdmlkZW5jZSIsImxvZ2luIjoiZXZpZGVuY2UiLCJpYXQiOjE1MTc4NjEyMDgsImV4cCI6MTUxNzg2NDgwOH0.lxkGYp3wagvVevOhBuRSUxCzavz_UUiqf-RLlzW89fw";
  },
}));
app.use('/graphql', bodyParser.json(), 
  qraphql_se.graphqlExpress(req=>({ 
    schema: GraphQLSchema, 
    context: {auth:req.auth},
    formatError: (error) => { 
      if (SentryOn) { Raven.captureException(error) }
      return error;
    },
    tracing: true,
    cacheControl: true
  }))
);


app.get('/r/*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (SentryOn) { Raven.captureException(err); }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
