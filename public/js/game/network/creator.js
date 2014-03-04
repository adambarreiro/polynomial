// -----------------------------------------------------------------------------
// Name: /public/js/game/network/creator.js
// Author: Adam Barreiro
// Description: Networking module for the multiplayer mode.
// Updated: 03-03-2014
// -----------------------------------------------------------------------------

/**
 * creator.js
 * @dependency /public/js/game/menu.js
 * @dependency /public/js/game/network.js
 */
define (["../menu", "require", "../network"], function(Menu, Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var SOCKET_INSTANCE;

/**
 * Tells the server the waiter is ready, asking for an registration of its IP.
 * @param  address - The IP address of the game creator
 */
function creatorAskForRegistration(address) {
    SOCKET_INSTANCE.emit("ready", {ip: address});
}
/**
 * Waits for the answer to the "ready" emit.
 */
function creatorOnRegistration(callback) {
    SOCKET_INSTANCE.on("ready", callback());
}
/**
 * Starts the game
 */
function creatorOnStart() {
    SOCKET_INSTANCE.on("start", function(data) {
        SOCKET_INSTANCE.emit("load", {ip: address});
    });
}

return {
    startCreator: function(address) {
        var Network = Require("network");
        SOCKET_INSTANCE = Network.getSocket();
        Menu.waitingMenu();
        creatorAskForRegistration(address);
    },
};

});