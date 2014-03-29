// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/enemy/enemy5.js
// Author: Adam Barreiro
// Description: Enemy 5 component.
// -----------------------------------------------------------------------------

/**
 * enemy6.js
 * @dependency /public/js/game/multi.js
 */
define (["../../../multi"],function(Multi) {

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
                if (!edition) {
                    this.reel("EnemyAnimationRight",600,0,0,6);
                    this.reel("EnemyAnimationLeft",600,0,1,6);
                    this._id = Multi.generateMultiId();
                }
            }
        });
    }
        
};

});