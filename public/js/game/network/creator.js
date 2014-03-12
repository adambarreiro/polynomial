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
var CREATOR_SERVER = "http://" + window.location.host;
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
        level: Menu.readSavegameCookie()
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
        Menu.startGame(Menu.readStudentCookie(), Menu.readSavegameCookie(),{multi: "creator"});
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
            CREATOR_ADDRESS = host;
            CREATOR_SOCKET = io.connect(CREATOR_SERVER);
            CREATOR_SOCKET.on("connect", function () {
                onRegister();
                onJoin();
                onDisconnected();
                emitRegister();
                CREATOR_STARTED = true;
            });
            /*
            var counter = 0;
            var caca = setInterval(function() {
                CREATOR_SOCKET.socket.connected
            },1000);*/

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