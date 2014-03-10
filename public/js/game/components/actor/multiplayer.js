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
            init: function() {
                this.requires("Actor, spr_multiplayer");
                this.gravity("Terrain").gravityConst(0.3);
                this.reel("MultiplayerMoveLeft",800,0,1,8);
                this.reel("MultiplayerMoveRight",800,0,2,8);
                this.reel("MultiplayerJumpLeft",300,0,3,3);
                this.reel("MultiplayerJumpRight",300,0,4,3);
                this.bind("EnterFrame", function () {
                    if (!this._up && !this.isPlaying("MultiplayerMoveRight") && !this.isPlaying("MultiplayerMoveLeft")) {
                        this.pauseAnimation();
                        if (this._orientation == "left") {
                            this.sprite(1,0);
                        } else {
                            this.sprite(0,0);
                        }
                    }
                    if (this._up) {
                        if (this._orientation === "right") {
                            if (!this.isPlaying("MultiplayerJumpRight")) {
                                this.animate("MultiplayerJumpRight",1);
                            }
                        }
                        else {
                            if (!this.isPlaying("MultiplayerJumpLeft")) {
                                this.animate("MultiplayerJumpLeft",1);
                            }
                        }
                    }
                });
                this.bind("Move", function(from) {
                    if(from.x < this.x) {
                        this._orientation="right";
                        if (!this._up) {
                            if (!this.isPlaying("MultiplayerMoveRight")){
                                this.animate("MultiplayerMoveRight",-1);
                            }
                        }
                    } else if (from.x > this.x) {
                        this._orientation="left";
                        if (!this._up) {
                            if (!this.isPlaying("MultiplayerMoveLeft")){
                                this.animate("MultiplayerMoveLeft",-1);
                            }
                        }
                    } else {
                        if (this._orientation == "left") {
                            this.sprite(1,0);
                        } else {
                            this.sprite(0,0);
                        }
                    }
                });
            }
        });
    }
};

});