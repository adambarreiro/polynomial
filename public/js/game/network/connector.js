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
var STARTED = false;
var SOCKET;
var CREATOR;
var CONNECTOR;

/**
 * Prepares the handler to the join emit response.
 * @param ourAddress - Our IP address
 * @param address - The IP address of the other player
 */
function onJoin() {
    var Menu = Require("menu");
    SOCKET.on("joinACK", function(data) {
        Menu.startGame(data.student, data.level,{online: true, mode: "creator"});
    });
    SOCKET.on("joinERROR", function() {
        alert("ERROR: Parece que tu IP ya está siendo usada.");
    });
    emitJoin();
}

/**
 * Tells the server we want to join a game
 */
function emitJoin() {
    SOCKET.emit("join", {
        id: SOCKET.socket.sessionid,
        address: CONNECTOR,
        player: CREATOR
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {

    /**
     * Creates the socket and controls all the events.
     * @param ourAddress - Our IP address
     * @param address - The IP address of the other player
     */
    startConnector: function(ourAddress, address) {
        if (!STARTED) {
            CONNECTOR = ourAddress;
            CREATOR = address;
            SOCKET = io.connect(CONNECTOR);
            SOCKET.on("connect", function () {
                onJoin();
                STARTED = true;
            });
        } else {
            emitJoin();
        }
    },
    /**
     * Sends the creator the connector position
     * @param x,y - The position of the character in the game
     */
    sendPosition: function(x,y) {
        SOCKET.emit("posConnectorToCreator", {
            address: CREATOR,
            x: x,
            y: y
        });
    },
    /**
     * Receives the position from the creator
     */
    onReceivePosition: function(callback) {
        SOCKET.on("posCreatorToConnector", function(data) {
            callback(data);
        });
    },
    /**
     * 
     */
    getSocket: function() {
        return SOCKET;
    },
    /**
     * Closes the socket.
     */
    closeConnector: function() {
        SOCKET.emit("close");
    }
};

});