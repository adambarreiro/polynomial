// -----------------------------------------------------------------------------
// Name: /public/js/game/components/terrain.js
// Author: Adam Barreiro Costa
// Description: Registers all the terrain components.
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

define (function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

/**
 * Registers all the child components.
 */
function createChildComponents() {
    // Lava
    Crafty.c('Abyss', {
        init: function() {
            this.requires('Terrain, spr_abyss');
        }
    });
    // Floor 1
    Crafty.c('Floor1', {
        init: function() {
            this.requires('Terrain, spr_floor1');
        }
    });
    // Floor 2
    Crafty.c('Floor2', {
        init: function() {
            this.requires('Terrain, spr_floor2');
        }
    });
    // Floor 3
    Crafty.c('Floor3', {
        init: function() {
            this.requires('Terrain, spr_floor3');
        }
    });
    // Floor 4
    Crafty.c('Floor4', {
        init: function() {
            this.requires('Terrain, spr_floor4');
        }
    });
    // Floor 5
    Crafty.c('Floor5', {
        init: function() {
            this.requires('Terrain, spr_floor5');
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
    registerComponents: function() {
        Crafty.c('Terrain', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('2D, Canvas, Color, Grid');
            }
        });
        createChildComponents();
    }
};
});