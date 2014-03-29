// -----------------------------------------------------------------------------
// Name: /public/js/game/components/item/exit.js
// Author: Adam Barreiro
// Description: Exit component.
// -----------------------------------------------------------------------------

/**
 * exit.js
 * @dependency /public/js/game/scenes.js
 */
define (["require", "../../scenes"], function(Require) {

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
             * Stops all the events
             */
            stopExit: function() {
                this.removeComponent("Collision");
                this.unbind("EnterFrame");
            },
            /**
             * Starts all the components attached and events.
             */
            startExit: function() {
                var Scenes = Require("../../scenes");
                this.addComponent("Collision");
                this.bind("EnterFrame", function(e) {
                    if(this.hit('Character')){
                        Crafty('Character').stopAll();
                        this.multiplayerExit();
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