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
var connections = []; // Array of connection data indexed by IP host.

/**
 * Searches for an id in the entire connections array and returns its
 * host.
 * @param id - The socket id to search
 * @return undefined if the host doesn't exist. Address in other case.
 */
function checkConnection(id) {
    for (var i in connections) {
        if (connections[i] !== undefined) {
            if (connections[i].id === id) {
                return i;
            }
        }
    }
    return undefined;
}

/**
 * Checks if the IP host of our friend exists in the connection
 */
function checkFriend(data) {
    return connections[data.friend] !== undefined;
}

/**
 * Receive a "ready" request from the creator player. We store it
 * in the connections variable.
 */
function responseReady(socket) {
    socket.on("ready", function (data) {
        if (connections[data.host] === undefined) {
            connections[data.host] = {
                id: socket.id,
                game: {
                    student: data.student,
                    level: data.level
                },
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
        console.log(data);
        if (connections[data.host] === undefined) {
            if (connections[data.friend] !== undefined) {
                connections[data.host] = {
                    id: socket.id,
                    friend: data.friend,
                };
                // Response to the connector with the game of the creator game
                socket.emit("joinACK", connections[data.friend].game);
                // Response to the creator for starting his game and the IP of the connector
                io.sockets.socket(connections[data.friend].id).emit("join", {friend: data.host});
            } else {
                socket.emit("joinERROR",{error: "noplayer"});
            }
        } else {
            socket.emit("joinERROR",{error: "already"});
        }
    });
}

/**
 * Receive an "engaged" request which implies that the game has started.
 */
function responseEngaged(socket) {
    socket.on("engaged", function (data) {
        connections[data.host].friend = data.friend;
        console.log('% Partida multijugador "'+data.host+'" empezada.');
    });
}

/**
 *  Handles the position events
 */
function responseSender(socket) {
    // Movement response
    socket.on("movementCreatorToConnector", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).volatile.emit("movementCreatorToConnector", {x: data.x, y: data.y});
    });
    socket.on("movementConnectorToCreator", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).volatile.emit("movementConnectorToCreator", {x: data.x, y: data.y});
    });
    // Damage response
    socket.on("damageCreatorToConnector", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).emit("damageCreatorToConnector", {enemy: data.enemy, damage: data.damage});
    });
    socket.on("damageConnectorToCreator", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).emit("damageConnectorToCreator", {enemy: data.enemy, damage: data.damage});
    });
    // Health update response
    socket.on("updateHealthCreatorToConnector", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).emit("updateHealthCreatorToConnector");
    });
    socket.on("updateHealthConnectorToCreator", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).emit("updateHealthConnectorToCreator");
    });
    socket.on("updateHealthCreatorToConnectorACK", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).emit("updateHealthCreatorToConnectorACK", {healths: data.healths});
    });
    socket.on("updateHealthConnectorToCreatorACK", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).emit("updateHealthConnectorToCreatorACK", {healths: data.healths});
    });
    // Exit response
    socket.on("exitCreatorToConnector", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).emit("exitCreatorToConnector");
    });
    socket.on("exitConnectorToCreator", function (data) {
        if (checkFriend(data))
            io.sockets.socket(connections[data.friend].id).emit("exitConnectorToCreator");
    });
}

/**
 *  The client disconnects for some reason.
 */
function responseDisconnect(socket) {
    socket.on("disconnect", function () {
        var host = checkConnection(socket.id);
        if (host !== undefined) {
            var friend = connections[host].friend;
            if (friend !== undefined && connections[friend] !== undefined) {
                io.sockets.socket(connections[friend].id).emit("disconnected");
                if (connections[friend].game !== undefined) {
                    // Connector. Kill his session
                    delete connections[friend];
                    connections[friend] = undefined;
                }
            }
            delete connections[host];
            connections[host] = undefined;
        }
    });
}

/**
 *  Receive a "close" request to close the socket. So we do.
 */
function responseClose(socket) {
    socket.on("close", function () {
        var host = checkConnection(socket.id);
        if (host !== undefined) {
            delete connections[host];
            connections[host] = undefined;
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
    io.configure( function(){
        io.set('log level', 1);
        // heroku labs:enable websockets -a myapp
        io.set('transports',['websocket', 'flashsocket','htmlfile', 'xhr-polling','jsonp-polling']);
        io.set('polling duration',10);
    });
    // Connection events
    io.on('connection', function (socket) {
        responseReady(socket);
        responseJoin(socket);
        responseEngaged(socket);
        responseClose(socket);
        responseDisconnect(socket);
        responseSender(socket);
    });

}
exports.createRouter = createRouter;
