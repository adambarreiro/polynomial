// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/enemy/enemy1.js
// Author: Adam Barreiro
// Description: Enemy 1 component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * enemy1.js
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
        Crafty.c('Enemy1', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Enemy, spr_enemy1');
            }
        });
    }
        
};

});