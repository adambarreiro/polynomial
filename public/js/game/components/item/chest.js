// -----------------------------------------------------------------------------
// Name: /public/js/game/components/item/chest.js
// Author: Adam Barreiro
// Description: Chest component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * chest.js
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
        Crafty.c('Chest', {
            _chestOpened: false, // If the chest's been opened.
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Item, spr_chest');
                this.z=1;
            }
        });
    }
};

});