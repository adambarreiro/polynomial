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
var connections = []; // Array of connection data indexed by IP address.

/**
 * Searches for an id in the entire connections array and returns its
 * address.
 * @param id - The socket id to search
 * @return undefined if the address doesn't exist. Address in other case.
 */
function checkConnection(id) {
    for (var i in connections) {
        if (connections[i] !== undefined) {
            console.log(i);
            if (connections[i].id === id) {
                console.log(i);
                return i;
            }
        }
    }
    return undefined;
}

/**
 * Receive a "ready" request from the creator player. We store it
 * in the connections variable.
 */
function responseReady(socket) {
    socket.on("ready", function (data) {
        if (connections[data.address] === undefined) {
            connections[data.address] = {
                id: socket.id,
                game: {
                    student: data.student,
                    level: data.level
                },
                creator: true
            };
            socket.emit("readyACK");
        } else {
            socket.emit("readyERROR");
        }
    });
}

/**
 *  Receive a "join" request from the creator player. 
 */
function responseJoin(socket) {
    socket.on("join", function (data) {
        if (connections[data.address] === undefined) {
            if (connections[data.player] !== undefined) {
                connections[data.address] = {
                    id: socket.id,
                    address: data.address,
                    player: data.player,
                    connector: true
                };
                // Response to the connector with the game of the creator game
                socket.emit("joinACK", connections[data.player].game);
                // Response to the creator for starting his game and the IP of the connector
                io.sockets.socket(connections[data.player].id).emit("join", {player: data.address});
            } else {
                socket.emit("joinERROR",{error: "noplayer"});
            }
        } else {
            socket.emit("joinERROR",{error: "already"});
        }
    });
}

/**
 *  Handles the position events
 */
function responseSender(socket) {
    socket.on("posCreatorToConnector", function (data) {
        io.sockets.socket(connections[data.address].id).emit("posCreatorToConnector", {x: data.x, y: data.y});
    });
    socket.on("posConnectorToCreator", function (data) {
       io.sockets.socket(connections[data.address].id).emit("posConnectorToCreator", {x: data.x, y: data.y});
    });
}

/**
 *  The client disconnects for some reason.
 */
function responseDisconnect(socket) {
    socket.on("disconnect", function () {
        var address = checkConnection(socket.id);
        if (address !== undefined) {
            delete connections[address];
            connections[address] = undefined;
        }
    });
}

/**
 *  Receive a "close" request to close the socket. So we do.
 */
function responseClose(socket) {
    socket.on("close", function () {
        var address = checkConnection(socket.id);
        if (address !== undefined) {
            delete connections[address];
            connections[address] = undefined;
        }
        
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
    io.set('log level', 1);
    // Connection events
    io.on('connection', function (socket) {
        responseReady(socket);
        responseJoin(socket);
        responseClose(socket);
        responseDisconnect(socket);
        responseSender(socket);
    });

}
exports.createRouter = createRouter;
