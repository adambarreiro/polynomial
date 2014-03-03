// -----------------------------------------------------------------------------
// Name: /main.js
// Author: Adam Barreiro Costa
// Description: Starts the server and all its handlers in order to serve the
// game.
// Updated: 23-10-2013
// -----------------------------------------------------------------------------
 
// -----------------------------------------------------------------------------
// Modules
// ----------------------------------------------------------------------------- 
var express = require('express');
var http = require('http');
// var https = require('https');
var fs = require('fs');
var mongoose = require('mongoose');
var handlers = require('./handlers/general.js');
var paths = require('./paths.js');

// ----------------------------------------------------------------------------- 
start(8080,8443); // Starts the server and opens the database.
handlers.setGetHandlers(); // Starts the GET requests handler.
handlers.setPostHandlers(); // Starts the POST requests handler.
handlers.setAjaxHandlers(); // Starts the AJAX handler.
end(); // Prepares the server to exit.
// ----------------------------------------------------------------------------- 

/**
 * Starts the server.
 * @param port - The port at which the server will listen unsafe connections.
 * @param securePort - The port at which the server will listen HTTPS connections.
 */
function start(port, securePort) {
    app = express();
    app.configure(function () {
        app.use(express.favicon());
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({secret: "pfc_adambarreiro"}));
        app.use(express.static(__dirname + '/public'));
        app.use(express.csrf());
    });
    var options = {
        key: fs.readFileSync(paths.keyPath()),
        cert: fs.readFileSync(paths.certPath())
    };
    var unsecure = http.createServer(app);
    unsecure.listen(port);
    //var secure = https.createServer(options, app);
    //secure.listen(securePort);
    var io = require('socket.io').listen(unsecure);
    io.on('connection', function (socket) {
        console.log("Connection");
        socket.on("send", function (data) {
            socket.broadcast.emit("receive", data);
        });
     });
    mongoose.connect('mongodb://localhost/polynomial');
}

/**
 * Finishes the server closing all the connections.
 */
function end() {
    process.on('exit', function() {
        mongoose.disconnect();
    });
}