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
var CREATOR_STARTED = false;
var CREATOR_SOCKET;
var CREATOR_CONNECTORADDRESS;
var CREATOR_ADDRESS;

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * Prepares the handler to the ready emit response.
 * @param  address - Our IP address
 */
function onRegister() {
    var Menu = Require("menu");
    CREATOR_SOCKET.on("readyACK", function() {
        Menu.waitingMenu(CREATOR_ADDRESS);
    });
    CREATOR_SOCKET.on("readyERROR", function() {
        alert("ERROR: Parece que tu IP ya está siendo usada.");
    });
    emitRegister();
}

/**
 * Tells the server that we want to create a new game, sending our game data.
 * @param  address - Our IP address
 */
function emitRegister() {
    var Menu = Require("menu");
    CREATOR_SOCKET.emit("ready", {
        address: CREATOR_ADDRESS,
        student: Menu.readStudentCookie(),
        level: Menu.readSavegameCookie()
    });
}

/**
 * Makes our client wait for a player to join us
 */
function wait() {
    var Menu = Require("menu");
    CREATOR_SOCKET.on("join", function(data) {
        CREATOR_CONNECTORADDRESS = data.player;
        Menu.startGame(Menu.readStudentCookie(), Menu.readSavegameCookie(),{creator: true, connector: false});
    });
}

return {
    /**
     * Starts the socket and all the events.
     * @param  address - Our IP address
     */
    startCreator: function(address) {
        if (!CREATOR_STARTED) {
            CREATOR_ADDRESS = address;
            CREATOR_SOCKET = io.connect(CREATOR_ADDRESS);
            CREATOR_SOCKET.on("connect", function () {
                onRegister();
                wait();
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
        CREATOR_SOCKET.emit("posCreatorToConnector", {
            address: CREATOR_CONNECTORADDRESS,
            x: x,
            y: y
        });
    },
    /**
     * Receives the position from the connector
     */
    onReceiveMovement: function(callback) {
        CREATOR_SOCKET.on("posConnectorToCreator", function(data) {
            callback(data);
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