// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/enemy/enemy4.js
// Author: Adam Barreiro
// Description: Enemy 4 component.
// -----------------------------------------------------------------------------

/**
 * enemy4.js
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
        Crafty.c('Enemy4', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Enemy, spr_enemy4');
                if (!edition) {
                    this.reel("EnemyAnimationLeft",400,0,1,4);
                    this.reel("EnemyAnimationRight",400,0,0,4);
                    this._id = Multi.generateMultiId();
                }
            }
        });
    }
        
};

});