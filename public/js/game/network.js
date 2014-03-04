// -----------------------------------------------------------------------------
// Name: /public/js/game/network.js
// Author: Adam Barreiro
// Description: Networking module for the multiplayer mode.
// Updated: 03-03-2014
// -----------------------------------------------------------------------------

/**
 * network.js
 * @dependency /public/js/game/network/connector.js
 * @dependency /public/js/game/network/creator.js
 */
define (["./network/connector", "./network/creator"], function(Connector, Creator) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var SOCKET; // The socket for the connection
var IP;

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {

    createCreator: function(address) {
        IP = address;
        SOCKET = io.connect(IP);
        SOCKET.on("connect", function () {
            Creator.startCreator(IP);

        });
    },
    createConnector: function(address) {
        var Menu = Require("menu");
        var Creator = Require("creator");
        SOCKET = io.connect(address);
        SOCKET.on("connect", function () {
            Menu.connectionMenu();
            connectorOnCreatorRetrieved(function() {
                connectorEngage(address);
                Menu.startGame(Menu.readStudentCookie(), Menu.readSavegameCookie());
            });
            connectorAskForCreator(address);
        });
    },
    getSocket: function() {
        return SOCKET;
    },
    getIp: function() {
        return IP;
    }
};

});