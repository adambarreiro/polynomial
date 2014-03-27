// -----------------------------------------------------------------------------
// Name: /public/js/game/network/creator.js
// Author: Adam Barreiro
// Description: Networking module for the multiplayer mode.
// Updated: 03-03-2014
// -----------------------------------------------------------------------------

/**
 * creator.js
 * @dependency /public/js/game/menu.js
 */
define (["require","../menu"], function(Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var CREATOR_SERVER;
var CREATOR_STARTED = false;
var CREATOR_SOCKET;
var CREATOR_CONNECTORADDRESS;
var CREATOR_ADDRESS;

/**
 * Prepares the handler to the ready emit response.
 * @param  host - Our IP host
 */
function onRegister() {
    var Menu = Require("menu");
    CREATOR_SOCKET.on("readyACK", function() {
        Menu.waitingMenu(CREATOR_ADDRESS);
    });
    CREATOR_SOCKET.on("readyERROR", function() {
        alert("ERROR: Este nombre ya se está usando en una partida ahora mismo.");
        Menu.createPanel();
    });
}

/**
 * Tells the server that we want to create a new game, sending our game data.
 * @param  host - Our IP host
 */
function emitRegister() {
    var Menu = Require("menu");
    CREATOR_SOCKET.emit("ready", {
        host: CREATOR_ADDRESS,
        student: Menu.readStudentCookie(),
        level: Menu.getLevel()
    });
}

/**
 * Makes our client wait for a player to join us
 */
function onJoin() {
    CREATOR_SOCKET.on("join", function(data) {
        var Menu = Require("menu");
        CREATOR_CONNECTORADDRESS = data.friend;
        emitEngaged();
        Menu.startGame(Menu.readStudentCookie(), Menu.getLevel(),{multi: "creator"});
    });
}

/**
 * Sends the server we're starting the game
 */
function emitEngaged() {
    CREATOR_SOCKET.emit("engaged", {
        host: CREATOR_ADDRESS,
        friend: CREATOR_CONNECTORADDRESS
    });
}

/**
 * The other player disconnects.
 */
function onDisconnected() {
    CREATOR_SOCKET.on("disconnected", function() {
        Crafty("Character").stopMultiplayer();
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Starts the socket and all the events.
     * @param  host - Our IP host
     */
    startCreator: function(host) {
        if (!CREATOR_STARTED) {
            var CREATOR_SERVER = "http://" + window.location.hostname;
            if (window.location.port === "") CREATOR_SERVER += ":80";
            else CREATOR_SERVER += ":"+window.location.port;
            CREATOR_ADDRESS = host;
            CREATOR_SOCKET = io.connect(CREATOR_SERVER);
            CREATOR_SOCKET.on("connecting", function() {
                var html = ['<div class="menu">',
                                '<div class="separator">Conectando con el servidor...</div>',
                                '<p>Enviando petición de conexión al servidor...</p>',
                            '</div>'].join("\n");
                $('.container').empty();
                $('.container').append(html);
            });
            CREATOR_SOCKET.on("error", function() {
                window.location = "/game";
            });
            CREATOR_SOCKET.on("connect", function () {
                onRegister();
                onJoin();
                onDisconnected();
                emitRegister();
                CREATOR_STARTED = true;
            });
        } else {
            emitRegister();
        }
    },
    /**
     * Sends the connector the creator position
     * @param x,y - The position of the character in the game.
     */
    sendMovement: function(x,y) {
        CREATOR_SOCKET.emit("movementCreatorToConnector", {
            friend: CREATOR_CONNECTORADDRESS,
            x: x,
            y: y
        });
    },
    /**
     * Receives the position from the connector
     */
    onReceiveMovement: function(callback) {
        CREATOR_SOCKET.on("movementConnectorToCreator", function(data) {
            callback(data);
        });
    },
    /**
     * Sends the connector the damage to an enemy
     * @param enemy - The enemy to substract the life
     * @param damage - Amount of life to substract.
     */
    sendDamage: function(enemy, damage) {
        CREATOR_SOCKET.emit("damageCreatorToConnector", {
            friend: CREATOR_CONNECTORADDRESS,
            enemy: enemy,
            damage: damage
        });
    },
    /**
     * Receives the damage to an enemy
     */
    onReceiveDamage: function(callback) {
        CREATOR_SOCKET.on("damageConnectorToCreator", function(data) {
            callback(data);
        });
    },
    /**
     * Sends the connector a request for recover the enemy healths
     */
    sendUpdateHealth: function() {
        CREATOR_SOCKET.emit("updateHealthCreatorToConnector", {
            friend: CREATOR_CONNECTORADDRESS
        });
    },
    /**
     * Receives the enemy healths
     */
    onReceiveUpdateHealth: function(callback) {
        CREATOR_SOCKET.on("updateHealthConnectorToCreator", function() {
            var healths = [];
            var enemyArray = Crafty("Enemy");
            for (var i=0; i<enemyArray.length; i++) {
                if (enemyArray[i] !== undefined) {
                    if (this._id === i) {
                        healths.push(this._enemyHealth);
                    } else {
                        healths.push(0);
                    }
                }  else {
                    healths.push(0);
                }
            }
        });
        CREATOR_SOCKET.emit("updateHealthCreatorToConnectorACK", {
            friend: CREATOR_CONNECTORADDRESS,
            healths: healths
        });
        CREATOR_SOCKET.on("updateHealthConnectorToCreatorACK", function(data) {
            callback(data);
        });
    },
    /**
     * Sends the connector the change of a level
     */
    sendExit: function() {
        CREATOR_SOCKET.emit("exitCreatorToConnector", {
            friend: CREATOR_CONNECTORADDRESS
        });
    },
    /**
     * Receives the change of a level
     */
    onReceiveExit: function(callback) {
        CREATOR_SOCKET.on("exitConnectorToCreator", function() {
            callback();
        });
    },
    /**
     * Closes the socket
     */
    closeCreator: function() {
        CREATOR_SOCKET.emit("close");
    }
};

});