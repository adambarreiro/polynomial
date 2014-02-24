// -----------------------------------------------------------------------------
// Name: /public/js/game/components/grid.js
// Author: Adam Barreiro Costa
// Description: Contains the parent component.
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

define (function() {

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    /**
     * Registers the component into the game.
     */
    registerComponents: function() {
        Crafty.c('Grid', {
            /**
             * Inits the component
             */
            init: function() {
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
    }
};
});