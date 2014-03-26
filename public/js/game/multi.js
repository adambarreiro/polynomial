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
    setEnemyTotal: function(n) {
        ENEMYTOTAL = n;
    },
    setMultiplayer: function(multiplayer) {
        MULTIPLAYER = multiplayer;
    },
    generateMultiId: function() {
        return ENEMYTOTAL++;
    }
};

});