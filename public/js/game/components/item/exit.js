// -----------------------------------------------------------------------------
// Name: /public/js/game/components/item/exit.js
// Author: Adam Barreiro
// Description: Exit component.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * exit.js
 * @dependency /public/js/game/scenes.js
 */
define (["../../scenes"], function(Scenes) {

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(edition) {
        Crafty.c('Exit', {
            /**
             * Sends the multiplayer we've changed the level
             */
            multiplayerExit: function() {
                if (Crafty("Multiplayer").length > 0) {
                    Crafty("Character").multiplayerExit();
                }
            },
            /**
             * Starts all the components attached and events.
             */
            startExit: function() {
                this.addComponent("Collision");
                this.bind("EnterFrame", function(e) {
                    if(this.hit('Character')){
                        this.multiplayerExit();
                        Crafty('Character').stopAll();
                        Scenes.nextLevel();
                    }
                });
            },
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Item, spr_exit');
                if (!edition) this.startExit();
            }
        });
    }
};

});