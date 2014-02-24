// -----------------------------------------------------------------------------
// Name: /public/js/game/components/body.js
// Author: Adam Barreiro Costa
// Description: Unites all the components in one single component.
// Updated: 24-02-2013
// -----------------------------------------------------------------------------

/**
 * Body.js
 * @dependency /public/js/game/components/lava.js
 * @dependency /public/js/game/components/jump.js
 */
define (["./lava", "./jump"], function(Lava, Jump) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the engine.
     */
    init: function() {
        Crafty.c('Body', {
            init: function() {
                this.requires('2D, Canvas, SpriteAnimation, Collision, Grid, Gravity, Keyboard, Fourway, spr_char');
                Lava.createComponent();
                Jump.createComponent();
                this.addComponent("Jump");
            }
        });
    }
};

});