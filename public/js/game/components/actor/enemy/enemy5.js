// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/enemy/enemy5.js
// Author: Adam Barreiro
// Description: Enemy 5 component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * enemy5.js
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
        Crafty.c('Enemy5', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Enemy, spr_enemy5');
            }
        });
    }
        
};

});