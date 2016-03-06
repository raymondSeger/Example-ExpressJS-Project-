// main.js
var greeting 		= require("./greeting.js");
var responseTime 	= require('response-time');
var express  		= require('express');
var cookieParser 	= require('cookie-parser');
var app 	 		= express();
var router 			= express.Router();
var favicon 		= require('serve-favicon');
var morgan 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var helmet 			= require('helmet');
var cookieSession	= require('cookie-session');
var request 		= require('request');
var fs 				= require('fs-extra');


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

// set static files
app.use('/public', express.static('public'));

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

// load the middlewares
app.use(cookieParser());
// This will create header of howLongItTakes to show how long it takes for the server to process the request
// https://github.com/expressjs/response-time
app.use(responseTime({
	'header' : "howLongItTakes"
}))

// set the favicon
// https://github.com/expressjs/serve-favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

// morgan logger
// https://github.com/expressjs/morgan
app.use(morgan('combined'))

// cookie handler
// https://github.com/expressjs/cookie-parser
app.use(cookieParser())
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('cookieName', randomNumber, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully');
  } 
  else
  {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  } 
  next(); // <-- important! go to the next middleware
});

// use HelmetJS https://github.com/helmetjs/
// Only let me be framed by people of the same origin:
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.frameguard())  // defaults to sameorigin
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.noCache({ noEtag: true }));
// Enable DNS prefetching (less secure but faster):
app.use(helmet.dnsPrefetchControl({ allow: true }));
app.use(helmet.xssFilter());

// cookie-session
// https://github.com/expressjs/cookie-session
app.set('trust proxy', 1); // trust first proxy
app.use(cookieSession({
  name: 'session',  // The name of the cookie to set
  keys: ['key1', 'key2'] // first key is for sign & second for verify
}));





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
app.get('/jadeExample1', function (req, res,  next) {
  res.render( __dirname + '/view/index', { title: 'Hey', message: 'Hello there!'});
});

// this will render the jade template inside current_direction() + /view/index
app.get('/getCookieSession', function (req, res, next) {

	if( req.session.views == null) {
		req.session.views = 0;
	}
	req.session.views = req.session.views + 1;
    res.send(req.session.views + " views");
});

app.get('/useRequest', function (req, res, next) {

	request('http://www.google.com', function (error, response, body) {

	  if (!error && response.statusCode == 200) {
	    res.send(body) // Show the HTML for the Google homepage. 
	  }

	})
});

app.get('/testFSExtra', function (req, res, next) {

	fs.mkdirs( __dirname + '/tmp/some/long/path/that/prob/doesnt/exist', function (err) {
	  if (err) {
	  	return console.error(err)
	  }
	})

	res.send('end');

});



/////////////////////////
// Start the App
/////////////////////////
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});