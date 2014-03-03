// -----------------------------------------------------------------------------
// Name: /public/js/game/components/terrain/floor2.js
// Author: Adam Barreiro
// Description: Floor 2 component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * floor2.js
 */
define (function() {

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(edition) {
        Crafty.c('Floor2', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Terrain, spr_floor2');
            }
        });
    }
};

});