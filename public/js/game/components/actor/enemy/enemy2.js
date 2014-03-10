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
                if (!edition) {
                    this.reel("EnemyAnimationLeft",300,0,0,3);
                    this.reel("EnemyAnimationRight",300,0,1,3);
                }
            }
        });
    }
        
};

});