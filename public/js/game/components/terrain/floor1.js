// -----------------------------------------------------------------------------
// Name: /public/js/game/components/terrain/floor1.js
// Author: Adam Barreiro
// Description: Floor 1 component.
// -----------------------------------------------------------------------------

/**
 * floor1.js
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
        Crafty.c('Floor1', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Terrain, spr_floor1');
            }
        });
    }
};

});