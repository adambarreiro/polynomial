// -----------------------------------------------------------------------------
// Name: /public/js/game/components/item.js
// Author: Adam Barreiro Costa
// Description: Registers all the item components.
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

/**
 * item.js
 * @dependency /public/js/game/components/exit.js
 */
define (["./item/exit"],function(Exit) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
/**
 * Registers all the child components.
 */
function createChildComponents(edition) {
    // The exit door
    Exit.registerComponent(edition);
    // The hide to hide
    Hide.registerComponent(edition);
    // Chests
    Chest.registerComponent(edition);
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(editing) {
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