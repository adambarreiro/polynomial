// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor.js
// Author: Adam Barreiro Costa
// Description: Registers all the actor components.
// -----------------------------------------------------------------------------

/**
 * Actor.js
 * @dependency /public/js/game/components/actor/enemy.js
 * @dependency /public/js/game/components/actor/character.js
 * @dependency /public/js/game/components/actor/multiplayer.js
 */
define (["./actor/enemy", "./actor/character", "./actor/multiplayer"], function(Enemy, Character, Multiplayer) {

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
    // Multiplayer component
    Multiplayer.registerComponent(edition);
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
                this.requires('Grid, Sprite, SpriteAnimation, Gravity, Collision');
            }
        });
        createChildComponents(edition);
    }
};
});