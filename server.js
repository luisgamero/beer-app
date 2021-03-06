var mysql = require('mysql');
var express = require('express');

//Middleware
var parser = require('body-parser');
var router = require(__dirname + '/backend/routes.js');

// Router
var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set("port", process.env.PORT || 8080);

// Logging and parsing
app.use(parser.json());

//Use cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, beeroclock-token, userId');
  next();
});

// Serving static files from client directory.
app.use(express.static(__dirname + '../desktop_client'));
// app.use('/',  express.static(path.join(__dirname, '../desktop_client/'))); ///what is this for?

// Set up our routes
app.use("/", router);

// If we are being run directly, run the server.
if (!module.parent) {
    app.listen(app.get("port"));
    console.log("Listening on", app.get("port"));
}
