// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor.js
// Author: Adam Barreiro Costa
// Description: Registers all the actor components.
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

/**
 * Actor.js
 * @dependency /public/js/game/components/actor/enemy.js
 * @dependency /public/js/game/components/actor/character.js
 */
define (["./actor/enemy", "./actor/character"], function(Enemy, Character) {

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
                this.requires('Grid, SpriteAnimation, Gravity, Collision');
            }
        });
        createChildComponents(edition);
    }
};
});