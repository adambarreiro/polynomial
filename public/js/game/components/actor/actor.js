// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor.js
// Author: Adam Barreiro Costa
// Description: Registers all the actor components.
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

/**
 * actor.js
 * @dependency /public/js/game/components/actor/patrol.js
 * @dependency /public/js/game/components/actor/character.js
 */
define (["./enemy", "./character"], function(Enemy, Character) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

/**
 * Registers all the child components.
 */
function createChildComponents(edition) {
    // Enemy component
    Enemy.registerComponent(edition);
    // Character component
    Character.registerComponent(edition);
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(edition) {
        Crafty.c('Actor', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('2D, Canvas, Color, SpriteAnimation, Grid');
            }
        });
        createChildComponents(edition);
    }
};
});