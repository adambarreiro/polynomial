// -----------------------------------------------------------------------------
// Name: /public/js/game/multi.js
// Author: Adam Barreiro
// Description: Multiplayer ID generator for the enemies to solve a CraftyJS
// identifier issue.
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
    getEnemyTotal: function(n) {
        return ENEMYTOTAL;
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