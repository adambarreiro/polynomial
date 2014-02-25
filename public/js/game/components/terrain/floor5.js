// -----------------------------------------------------------------------------
// Name: /public/js/game/components/terrain/floor5.js
// Author: Adam Barreiro
// Description: Floor 5 component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * floor5.js
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
        Crafty.c('Floor5', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Terrain, spr_floor5');
            }
        });
    }
};

});