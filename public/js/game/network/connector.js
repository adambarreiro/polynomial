// -----------------------------------------------------------------------------
// Name: /public/js/game/network/connector.js
// Author: Adam Barreiro
// Description: Networking module for the multiplayer mode.
// Updated: 03-03-2014
// -----------------------------------------------------------------------------

/**
 * connector.js
 * @dependency /public/js/game/menu.js
 * @dependency /public/js/game/network.js
 */
define (["../menu", "require", "../network"], function(Menu, Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Tells the server the waiter is ready, asking for an identifier for the IP.
     * @param  address - The IP address of the game creator
     */
    connectorAskForCreator: function(address) {
        SOCKET.emit("enter", {ip: address});
    },
    /**
     * Tells the server the waiter is ready, asking for an identifier for the IP.
     * @param  address - The IP address of the game creator
     */
    connectorOnCreatorRetrieved: function(callback) {
        SOCKET.on("enter", callback());
    },
    /**
     * Tells the server to ask the creator to load the game.
     */
    connectorEngage: function(address) {
        var Menu = Require("menu");
        SOCKET.emit("load");
    }
};

});