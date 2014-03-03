// -----------------------------------------------------------------------------
// Name: /public/js/game/network.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

define (function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var SOCKET;
var SOCKET2;


// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {

    createServer: function(address) {
        SOCKET = io.connect(address);
        SOCKET.on("connect", function () {
            SOCKET.on('receive', function (data) {
                alert(data);
            });
        });
    },
    createClient: function(address) {
        SOCKET2 = io.connect(address);
        SOCKET2.on("connect", function () {
            SOCKET2.emit("send", {
                caca: "caca2"
            });
        });
    }
};

});