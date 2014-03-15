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
var https = require('https');
var mongoose = require('mongoose');
var handlers = require('./handlers/general.js');
var config = require('./configuration.js');
var router = require('./network/router.js');
var errors = require('./errors.js');

/**
 * Starts the server.
 * @param port - The port at which the server will listen unsafe connections.
 * @param securePort - The port at which the server will listen HTTPS connections.
 */
function startNodeServer(port, securePort) {
    console.log("(i) INFO: Arrancando Express.");
    app = express();
    // Configuration of the server
    app.configure(function () {
        app.use(express.favicon(__dirname + '/public/assets/img/favicon.jpg'));
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({secret: "pfc_adambarreiro"}));
        app.use(express.static(__dirname + '/public'));
        //app.use(express.csrf()); // Avoids Cross-Site Request Forgery attacks
        //app.use(errors.handle403);
    });
    console.log("(i) INFO: Leyendo certificados.");
    // Certificates
    var options = {
        key: config.keyConfiguration(),
        cert: config.certConfiguration()
    };
    console.log("(i) INFO: Creando servidor HTTP.");
    // Create the two different servers
    var unsecure = http.createServer(app);
    unsecure.listen(process.env.PORT || port);
    /*console.log("(i) INFO: Creando servidor HTTPS.");
    var secure = https.createServer(options, app);
    secure.listen(securePort);*/
    // Creates the socket router for the multiplayer
    console.log("(i) INFO: Arrancando Socket.io para el multijugador.");
    router.createRouter(unsecure);
    // Opens the database connection
    console.log("(i) INFO: Conectando a la base de datos.");
    mongoose.connect(config.databaseConfiguration());
    // Starts all the handlers
    console.log("(i) INFO: Iniciando los manejadores GET");
    handlers.setGetHandlers();
    console.log("(i) INFO: Iniciando los manejadores POST");
    handlers.setPostHandlers();
    console.log("(i) INFO: Iniciando los manejadores Ajax");
    handlers.setAjaxHandlers();
    // Handles the exit event
    console.log("(i) INFO: Servidor listo y funcionando.");
    process.on('exit', function() {
        mongoose.disconnect();
    });
    console.log("(i) INFO: A partir de ahora se mostrará una traza de cualquier evento.");
}
console.log("%%% ARRANCANDO EL SERVIDOR DE POLYNOMIAL %%%");
if (config.checkConfiguration()) {
    startNodeServer(config.httpConfiguration(), config.httpsConfiguration());
}