// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/enemy/enemy2.js
// Author: Adam Barreiro
// Description: Enemy 2 component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * enemy2.js
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
        Crafty.c('Enemy2', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Enemy, spr_enemy2');
            }
        });
    }
        
};

});