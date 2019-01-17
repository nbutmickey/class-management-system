var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var studentApi = require('./api/studentApi');
var adminApi = require('./api/adminApi/index');
var studentApi = require('./api/studentApi/index');
var classTeacherApi = require('./api/classteacherApi/index');
var counselorApi = require('./api/counselorApi/index');
var loginApi = require('./api/login')
var app = express();


app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Token");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,x-token");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use('/',loginApi);
app.use('/', adminApi);
app.use('/', studentApi);
app.use('/', classTeacherApi);
app.use('/', counselorApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
