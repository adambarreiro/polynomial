// -----------------------------------------------------------------------------
// Name: /public/js/game/components/item.js
// Author: Adam Barreiro Costa
// Description: Registers all the item components.
// -----------------------------------------------------------------------------

/**
 * item.js
 * @dependency /public/js/game/components/exit.js
 * @dependency /public/js/game/components/hide.js
 * @dependency /public/js/game/components/chest.js
 */
define (["./item/exit", "./item/hide", "./item/chest", ],function(Exit, Hide, Chest) {

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
                this.requires('Grid');
            }
        });
        createChildComponents(editing);
    }
};
});