// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/enemy/enemy3.js
// Author: Adam Barreiro
// Description: Enemy 3 component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * enemy3.js
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
        Crafty.c('Enemy3', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Enemy, spr_enemy3');
                if (!edition) {
                    this.reel("EnemyAnimationLeft",600,0,0,6);
                    this.reel("EnemyAnimationRight",600,0,1,6);
                }
            }
        });
    }
        
};

});