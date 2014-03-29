// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/enemy/enemy1.js
// Author: Adam Barreiro
// Description: Enemy 1 component.
// -----------------------------------------------------------------------------

/**
 * enemy1.js
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
        Crafty.c('Enemy1', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Enemy, spr_enemy1');
                if (!edition) {
                    this.reel("EnemyAnimationLeft",300,0,0,3);
                    this.reel("EnemyAnimationRight",300,0,1,3);
                    this._id = Multi.generateMultiId();
                }
            }
        });
    }
        
};

});