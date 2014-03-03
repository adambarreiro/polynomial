// -----------------------------------------------------------------------------
// Name: /public/js/game/components/grid.js
// Author: Adam Barreiro Costa
// Description: Contains the parent component.
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

/**
 * grid.js
 * @dependency /public/js/game/constants.js
 * @dependency /public/js/game/components/terrain.js
 * @dependency /public/js/game/components/item.js
 * @dependency /public/js/game/components/actor.js
 */
define (["../constants", "./terrain", "./item", "./actor"], function(Constants, Terrain, Item, Actor) {

/**
 * Registers all the child components.
 */
function createChildComponents(edition) {
    Terrain.registerComponent(edition);
    Item.registerComponent(edition);
    Actor.registerComponent(edition);
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(edition) {
        Crafty.c('Grid', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('2D, Canvas');
                this.attr({
                    w: Constants.getTileSize('px').width,
                    h: Constants.getTileSize('px').height
                });
            },
            /**
             * Creates an entity in the (x,y) coords. If no coords given,
             * returns the coords of the selected entity.
             */
            at: function(x, y) {
                if (x === undefined && y === undefined) {
                    return {
                        x: this.x/Constants.getTileSize('px').width,
                        y: this.y/Constants.getTileSize('px').height,
                    };
                } else {
                    this.attr({
                        x: x * Constants.getTileSize('px').width,
                        y: y * Constants.getTileSize('px').height,
                    });
                return this;
                }
            }
        });
        createChildComponents(edition);
    }
};
});