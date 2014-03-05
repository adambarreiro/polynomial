// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/multiplayer.js
// Author: Adam Barreiro
// Description: Multiplayer character component
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

define (["../../network/connector", "../../network/creator"], function(Connector, Creator) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(edition) {
        Crafty.c('Multiplayer', {
            connectorMode: function() {
                Connector.onReceivePosition(function(data) {
                    Crafty("Multiplayer").x = data.x;
                    Crafty("Multiplayer").y = data.y;
                });
                this.bind("EnterFrame", function() {
                    Connector.sendPosition(this.x, this.y);
                });
            },
            creatorMode: function() {
                Creator.onReceivePosition(function(data) {
                    Crafty("Multiplayer").x = data.x;
                    Crafty("Multiplayer").y = data.y;
                });
                this.bind("EnterFrame", function() {
                    Creator.sendPosition(this.x, this.y);
                });
            },
            init: function() {
                this.requires('Actor, spr_mimic');
                this.z=6;
                if (!edition) {
                    this.gravity("Terrain").gravityConst(0.3);
                }
            }
        });
    }
};

});