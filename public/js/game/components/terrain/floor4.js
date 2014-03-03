// -----------------------------------------------------------------------------
// Name: /public/js/game/components/terrain/floor4.js
// Author: Adam Barreiro
// Description: Floor 4 component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * floor4.js
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
        Crafty.c('Floor4', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Terrain, spr_floor4');
            }
        });
    }
};

});