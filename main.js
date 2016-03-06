// main.js
var greeting 		= require("./greeting.js");
var express  		= require('express');
var cookieParser 	= require('cookie-parser');
var app 	 		= express();
var router 			= express.Router();

// set static files
app.use('/public', express.static('public'));





/////////////////////////
// Middle Ware
// http://expressjs.com/en/guide/using-middleware.html
// 
// most used middleware: http://expressjs.com/en/resources/middleware.html
// 
// Middleware = tamper the req, res object or do a console, etc
// If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware
/////////////////////////

// middleware 1
var middleware_myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};
app.use(middleware_myLogger);

// middleware 2
var middleware_requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};
app.use(middleware_requestTime);

// anynomous middleware for /user/ router
app.use('/user', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// error handling middleware requires 4 parameters
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// load the cookie-parsing middleware
app.use(cookieParser());





/////////////////////////
/// View Engine
/////////////////////////
app.set('view engine', 'jade');







/////////////////////////
// Routings
// http://expressjs.com/en/guide/routing.html
/////////////////////////

// this will call cb0 function then goes to cb1()
var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}
var cb1 = function (req, res, next) {
  var responseText = 'Hello World! ';
  responseText += 'Requested at: ' + req.requestTime + '';
  res.send(responseText);
}
app.get('/', [cb0, cb1]);

// this will call the anonymous middleware for /user
app.get('/user', function (req, res, next) {
  var responseText = 'Hello World! ';
  responseText += 'Requested at: ' + req.requestTime + '';
  res.send(responseText);
});

// this will render the jade template inside current_direction() + /view/index
app.get('/jadeExample1', function (req, res) {
  res.render( __dirname + '/view/index', { title: 'Hey', message: 'Hello there!'});
});








/////////////////////////
// Start the App
/////////////////////////
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});