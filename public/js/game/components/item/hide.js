// -----------------------------------------------------------------------------
// Name: /public/js/game/components/item/hide.js
// Author: Adam Barreiro
// Description: Hide component
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * hide.js
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
        Crafty.c('Hide', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Item, spr_hide');
                this.z=4;
            }
        });
    }
};

});