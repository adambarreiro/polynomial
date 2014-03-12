// -----------------------------------------------------------------------------
// Name: /public/js/game/network/connector.js
// Author: Adam Barreiro
// Description: Networking module for the multiplayer mode.
// Updated: 03-03-2014
// -----------------------------------------------------------------------------

/**
 * connector.js
 * @dependency /public/js/game/menu.js
 */
define (["require","../menu"], function(Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var CONNECTOR_SERVER = "http://" + window.location.host;
var CONNECTOR_STARTED = false;
var CONNECTOR_SOCKET;
var CONNECTOR_CREATORADDRESS;
var CONNECTOR_ADDRESS;

/**
 * Prepares the handler to the join emit response.
 * @param ourAddress - Our IP host
 * @param host - The IP host of the other player
 */
function onJoin() {
    CONNECTOR_SOCKET.on("joinACK", function(data) {
        var Menu = Require("menu");
        Menu.startGame(data.student, data.level, { multi: "connector"});
    });
    CONNECTOR_SOCKET.on("joinERROR", function(data) {
        if (data.error === "noplayer") {
            alert("ERROR: Parece que nadie ha creado una partida con este nombre.");
        } else {
            alert("ERROR: Este nombre ya se está usando en una partida ahora mismo.");
        }
    });
}

/**
 * Tells the server we want to join a game
 */
function emitJoin() {
    CONNECTOR_SOCKET.emit("join", {
        host: CONNECTOR_ADDRESS,
        friend: CONNECTOR_CREATORADDRESS
    });
}

/**
 * The other player disconnects.
 */
function onDisconnected() {
    CONNECTOR_SOCKET.on("disconnected", function() {
        Crafty("Character").stopMultiplayer();
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {

    /**
     * Creates the CONNECTOR_SOCKET and controls all the events.
     * @param host - The IP host of the other player
     */
    startConnector: function(host) {
        if (!CONNECTOR_STARTED) {
            CONNECTOR_ADDRESS = host + "connector";
            CONNECTOR_CREATORADDRESS = host;
            CONNECTOR_SOCKET = io.connect(CONNECTOR_SERVER);
            CONNECTOR_SOCKET.on("connect", function () {
                onJoin();
                onDisconnected();
                emitJoin();
                CONNECTOR_STARTED = true;
            });
        } else {
            emitJoin();
        }
    },
    /**
     * Sends the creator the connector position
     * @param x,y - The position of the character in the game
     */
    sendMovement: function(x,y) {
        CONNECTOR_SOCKET.emit("movementConnectorToCreator", {
            friend: CONNECTOR_CREATORADDRESS,
            x: x,
            y: y
        });
    },
    /**
     * Receives the position from the creator
     */
    onReceiveMovement: function(callback) {
        CONNECTOR_SOCKET.on("movementCreatorToConnector", function(data) {
            callback(data);
        });
    },
    /**
     * Sends the creator the damage to an enemy
     * @param enemy - The enemy to substract the life
     * @param damage - Amount of life to substract.
     */
    sendDamage: function(enemy, damage) {
        CONNECTOR_SOCKET.emit("damageConnectorToCreator", {
            friend: CONNECTOR_CREATORADDRESS,
            enemy: enemy,
            damage: damage
        });
    },
    /**
     * Receives the damage to an enemy
     */
    onReceiveDamage: function(callback) {
        CONNECTOR_SOCKET.on("damageCreatorToConnector", function(data) {
            callback(data);
        });
    },
    /**
     * Sends the creator the change of a level
     */
    sendExit: function() {
        CONNECTOR_SOCKET.emit("exitConnectorToCreator", {
            friend: CONNECTOR_CREATORADDRESS
        });
    },
    /**
     * Receives the change of a level
     */
    onReceiveExit: function(callback) {
        CONNECTOR_SOCKET.on("exitCreatorToConnector", function() {
            callback();
        });
    },
    /**
     * Closes the CONNECTOR_SOCKET.
     */
    closeConnector: function() {
        CONNECTOR_SOCKET.emit("close");
    }
};

});