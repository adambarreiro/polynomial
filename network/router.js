// -----------------------------------------------------------------------------
// Name: /network/router.js
// Author: Adam Barreiro Costa
// Description: 
// Updated: 03-03-2014
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
var io = require('socket.io');

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var connections = [];

/**
 * Receive a "ready" request from the creator player. We store it
 * in the connections variable.
 */
function responseReady() {
    socket.on("ready", function (data) {
        connections[data.ip] = socket.id;
        socket.emit("ready");
    });
}

/**
 *  Receive a "start" request from the connector player. We send the
 *  creator the response.
 */
function responseStart() {
    socket.on("start", function (data) {
        io.sockets.socket(connections[data.ip]).emit("enter");
    });
}

/**
 *  Receive a "enter" request from the connector player. We send the
 *  creator the response.
 */
function responseLoad() {
    socket.on("load", function (data) {
        io.sockets.socket(connections[data.ip]).emit("load", data);
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * Creates the socket.io structures and message protocol for the multiplayer.
 */
function createRouter(server) {
    // Creates the socket
    io = io.listen(server);
    // Connection events
    io.on('connection', function (socket) {
        responseReady();
        responseStart();
        responseLoad();
    });
}
exports.createRouter = createRouter;
