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
var STARTED = false;
var SOCKET;
var CREATOR;
var CONNECTOR;

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * Prepares the handler to the ready emit response.
 * @param  address - Our IP address
 */
function onRegister() {
    var Menu = Require("menu");
    SOCKET.on("readyACK", function() {
        Menu.waitingMenu(CREATOR);
    });
    SOCKET.on("readyERROR", function() {
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
    SOCKET.emit("ready", {
        address: CREATOR,
        student: Menu.readStudentCookie(),
        level: Menu.readSavegameCookie()
    });
}

/**
 * Makes our client wait for a player to join us
 */
function wait() {
    var Menu = Require("menu");
    SOCKET.on("join", function(data) {
        CONNECTOR = data.player;
        Menu.startGame(Menu.readStudentCookie(), Menu.readSavegameCookie(),{online: true, mode: "creator"});
    });
}

return {
    /**
     * Starts the socket and all the events.
     * @param  address - Our IP address
     */
    startCreator: function(address) {
        if (!STARTED) {
            CREATOR = address;
            SOCKET = io.connect(CREATOR);
            SOCKET.on("connect", function () {
                onRegister();
                wait();
                STARTED = true;
            });
        } else {
            emitRegister();
        }
    },
    /**
     * Sends the connector the creator position
     * @param x,y - The position of the character in the game.
     */
    sendPosition: function(x,y) {
        SOCKET.emit("posCreatorToConnector", {
            address: CONNECTOR,
            x: x,
            y: y
        });
    },
    /**
     * Receives the position from the connector
     */
    onReceivePosition: function(callback) {
        SOCKET.on("posConnectorToCreator", function(data) {
            callback(data);
        });
    },
    /**
     * Closes the socket
     */
    closeCreator: function() {
        SOCKET.emit("close");
    }
};

});