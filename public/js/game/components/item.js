// -----------------------------------------------------------------------------
// Name: /public/js/game/components/item.js
// Author: Adam Barreiro Costa
// Description: Registers all the item components.
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

/**
 * Item.js
 * @dependency /public/js/game/components/exit.js
 */
define (["./exit"],function(Exit) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
/**
 * Registers all the child components.
 */
function createChildComponents(editing) {
    // The exit door
    Exit.init(editing);
    // The hide to hide
    Crafty.c('Hide', {
        init: function() {
            this.requires('Item, spr_hide');
            this.z=4;
        }
    });
    // Chests
    Crafty.c('Chest', {
        _opened: false,
        init: function() {
            this.requires('Item, spr_chest');
            this.z=1;
        }
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    /**
     * Registers the component into the game.
     */
    registerComponents: function(editing) {
        Crafty.c('Item', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('2D, Canvas, Color, Grid');
            }
        });
        createChildComponents(editing);
    }
};
});