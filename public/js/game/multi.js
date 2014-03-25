// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var MULTIPLAYER;
var ENEMYTOTAL = 0;



// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    getMultiplayer: function() {
        return MULTIPLAYER;
    },
    setMultiplayer: function(multiplayer) {
        MULTIPLAYER = multiplayer;
    },
    setEnemyTotal: function(n) {
        ENEMYTOTAL = n;
    },
    generateMultiplayerId: function() {
        ENEMYTOTAL++;
        return ENEMYTOTAL;
    }
};

});