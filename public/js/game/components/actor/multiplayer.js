// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/multiplayer.js
// Author: Adam Barreiro
// Description: Multiplayer character component
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

define (function() {

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
            _orientation: "right",
            _started: false,
            _up: false,
            init: function() {
                this.requires("Actor, spr_multiplayer");
                this.reel("MultiplayerMoveLeft",800,0,1,8);
                this.reel("MultiplayerMoveRight",800,0,2,8);
                this.bind("Move", function(from) {
                    if (this._started) {
                        this._up = from._y > this.y;
                        if(from._x < this.x) {
                            this._orientation="right";
                            if (!this.isPlaying("MultiplayerMoveRight")){
                               this.animate("MultiplayerMoveRight",-1);
                            }
                        } else if (from._x > this.x) {
                            this._orientation="left";
                            if (!this.isPlaying("MultiplayerMoveLeft")){
                                this.animate("MultiplayerMoveLeft",-1);
                            }
                        }
                        if (this._up) {
                            if (this._orientation === "right") {
                                this.pauseAnimation();
                                this.sprite(1,4);
                            }
                            else {
                                this.pauseAnimation();
                                this.sprite(1,3);
                            }
                        }
                    } else {
                        this.sprite(0,0);
                    }
                    
                });
            }
        });
    }
};

});