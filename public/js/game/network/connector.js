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
var CONNECTOR_STARTED = false;
var CONNECTOR_SOCKET;
var CONNECTOR_CREATORADDRESS;
var CONNECTOR_ADDRESS;

/**
 * Prepares the handler to the join emit response.
 * @param ourAddress - Our IP address
 * @param address - The IP address of the other player
 */
function onJoin() {
    var Menu = Require("menu");
    CONNECTOR_SOCKET.on("joinACK", function(data) {
        Menu.startGame(data.student, data.level,{connector: true, creator: false});
    });
    CONNECTOR_SOCKET.on("joinERROR", function(data) {
        if (data.error === "noplayer") {
            alert("ERROR: Parece que nadie ha creado una partida en esa IP.");
        } else {
            alert("ERROR: Parece que tu IP ya está siendo usada.");
        }
        
    });
    emitJoin();
}

/**
 * Tells the server we want to join a game
 */
function emitJoin() {
    CONNECTOR_SOCKET.emit("join", {
        address: CONNECTOR_ADDRESS,
        player: CONNECTOR_CREATORADDRESS
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {

    /**
     * Creates the CONNECTOR_SOCKET and controls all the events.
     * @param ourAddress - Our IP address
     * @param address - The IP address of the other player
     */
    startConnector: function(ourAddress, address) {
        if (!CONNECTOR_STARTED) {
            CONNECTOR_ADDRESS = ourAddress;
            CONNECTOR_CREATORADDRESS = address;
            CONNECTOR_SOCKET = io.connect(CONNECTOR_ADDRESS);
            CONNECTOR_SOCKET.on("connect", function () {
                onJoin();
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
        CONNECTOR_SOCKET.emit("posConnectorToCreator", {
            address: CONNECTOR_CREATORADDRESS,
            x: x,
            y: y
        });
    },
    /**
     * Receives the position from the creator
     */
    onReceiveMovement: function(callback) {
        CONNECTOR_SOCKET.on("posCreatorToConnector", function(data) {
            callback(data);
        });
    },
    /**
     * 
     */
    getSOCKET_CONNECTOR: function() {
        return CONNECTOR_SOCKET;
    },
    /**
     * Closes the CONNECTOR_SOCKET.
     */
    closeConnector: function() {
        CONNECTOR_SOCKET.emit("close");
    }
};

});