// -----------------------------------------------------------------------------
// Name: /public/js/game/components/terrain.js
// Author: Adam Barreiro Costa
// Description: Registers all the terrain components.
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

/**
 * terrain.js
 * @dependency /public/js/game/components/terrain/abyss.js
 * @dependency /public/js/game/components/terrain/floor1.js
 * @dependency /public/js/game/components/terrain/floor2.js
 * @dependency /public/js/game/components/terrain/floor3.js
 * @dependency /public/js/game/components/terrain/floor4.js
 * @dependency /public/js/game/components/terrain/floor5.js
 */
define (["./terrain/abyss", "./terrain/floor1", "./terrain/floor2", "./terrain/floor3", "./terrain/floor4", "./terrain/floor5"], function(Abyss, Floor1, Floor2, Floor3, Floor4, Floor5) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

/**
 * Registers all the child components.
 */
function createChildComponents(edition) {
    // Lava
    Abyss.registerComponent(edition);
    // Floor 1
    Floor1.registerComponent(edition);
    // Floor 2
    Floor2.registerComponent(edition);
    // Floor 3
    Floor3.registerComponent(edition);
    // Floor 4
    Floor4.registerComponent(edition);
    // Floor 5
    Floor5.registerComponent(edition);
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(edition) {
        Crafty.c('Terrain', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Grid');
            }
        });
        createChildComponents(edition);
    }
};
});