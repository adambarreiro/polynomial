// -----------------------------------------------------------------------------
// Name: /public/js/game/components/terrain/floor3.js
// Author: Adam Barreiro
// Description: Floor 3 component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * floor3.js
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
        Crafty.c('Floor3', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Terrain, spr_floor3');
            }
        });
    }
};

});