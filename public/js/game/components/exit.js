// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["../scenes"], function(Scenes) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var DETECTED = false;


// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the engine.
     */
    init: function(editing) {
        Crafty.c('Exit', {
            startAll: function() {
                this.addComponent("Collision");
                    this.bind("EnterFrame", function(e) {
                        if(this.hit('Char')){
                            Crafty('Char').stopAll();
                            Scenes.nextLevel();
                        }
                    });
            },
            init: function() {
                this.requires('2D, Canvas, Grid, Color, spr_exit');
                if (!editing) {
                    this.startAll();
                }
            }
        });
    }
};

});