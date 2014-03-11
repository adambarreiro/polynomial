// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/movement.js
// Author: Adam Barreiro
// Description: Component for giving the character the ability to move.
// Updated: 24-02-2013
// -----------------------------------------------------------------------------

/**
 * movement.js
 * @dependency /public/js/game/constants.js
 */
define (["../../../constants"], function(Constants) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var JUMPY = 7; // Pixels that the character will move with every jump
var TIMEFALLING = 20; // Time falling

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Creates the component.
     */
    createComponent: function() {
        Crafty.c('Movement', {
            _posy: undefined,
            /**
             * Jumping event
             */
            jump: function() {
                // Collision check. This is the inverse of the Crafty.js gravity
                // component.
                var obj;
                var hit = false;
                var pos = this.pos();
                pos._y= pos._y-JUMPY;
                pos.x = pos._x;
                pos.y = pos._y;
                pos.w = pos._w;
                pos.h = pos._h;

                var q = Crafty.map.search(pos);
                var l = q.length;

                for (var i = 0; i < l; ++i) {
                    obj = q[i];
                    if (obj !== this && obj.has(this._anti) && obj.intersect(pos)) {
                        hit = obj;
                        break;
                    }
                }
                // Check if collision
                if (hit) {
                    // Collide
                    this.y = hit._y + this._h; // Makes the character stop
                } else {
                    // Dont collide, go up
                    if (this._up) {
                        this.clearLava();
                        this.y -= JUMPY;
                        this._falling = true;
                        if (this._orientation === "right") {
                            this.sprite(1,4);
                        }
                        else {
                            this.sprite(1,3);
                        }
                        this.trigger('Moved', { x: this._x, y: this._y + JUMPY });
                    }
                }
            },
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Lava');
                this.gravity("Terrain").gravityConst(0.3);
                this.multiway(3, {
                    RIGHT_ARROW: 0,
                    LEFT_ARROW: 180
                });
                this.bind("EnterFrame", function () {
                    this.jump();
                    if (!this._up && !this._falling && !this.isPlaying("CharMoveRight") && !this.isPlaying("CharMoveLeft")) {
                        this.pauseAnimation();
                        if (this._orientation == "left") {
                            this.sprite(1,0);
                        } else {
                            this.sprite(0,0);
                        }
                    }
                });
                this.bind("KeyDown", function () {
                    if (!this._falling && this.isDown("UP_ARROW")){
                        this._up = true;
                    } else if (this.isDown("RIGHT_ARROW")){
                        this._orientation="right";
                        if (!this._up && !this._falling && !this.isPlaying("CharMoveRight")){
                            this.animate("CharMoveRight",-1);
                        }
                    } else if (this.isDown("LEFT_ARROW")){
                        this._orientation="left";
                        if (!this._up && !this._falling && !this.isPlaying("CharMoveLeft")){
                            this.animate("CharMoveLeft",-1);
                        }
                    } else if (this.isDown("DOWN_ARROW")) {
                        this.trigger('Moved', { x: this._x, y: this._y });
                    }
                });
                this.bind("KeyUp", function(e) {
                    if(e.key === Crafty.keys.LEFT_ARROW) {
                        this.pauseAnimation();
                        this.sprite(1,0);
                    } else if (e.key === Crafty.keys.RIGHT_ARROW) {
                        this.pauseAnimation();
                        this.sprite(0,0);
                    }
                });
                this.bind("Moved", function(from) {
                    if (this.hit("Terrain")) {
                        this.x = from.x;
                    }
                    if (this.x <= 0 || this.x >= Constants.getLevelSize('px').width) {
                        this.x = from.x;
                    }
                    if(from.x < this.x) {
                        this._orientation="right";
                        if (!this._up && !this._falling && !this.isPlaying("CharMoveRight")){
                            this.animate("CharMoveRight",-1);
                        }
                    } else if (from.x > this.x) {
                        this._orientation="left";
                        if (!this._up && !this._falling && !this.isPlaying("CharMoveLeft")){
                            this.animate("CharMoveLeft",-1);
                        }
                    } else {
                        if (!this._up && !this._falling && this._orientation == "left") {
                            this.sprite(1,0);
                        } else if (!this._up && !this._falling && this._orientation == "right") {
                            this.sprite(0,0);
                        }
                    }
                });

            }
        });
    }
};

});