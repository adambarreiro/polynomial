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
            _jumpJumping: false,
            _jumpFalling: false,
            _jumpTimeFalling: 0,
            /**
             * Jumping event
             */
            jump: function() {
                if (this.isDown(Crafty.keys.UP_ARROW)) {
                    if (!this._jumpJumping && this._jumpFalling) {
                        //Crafty.audio.play("salto");
                    }
                    this._jumpJumping = true;
                }
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
                    this._jumpFalling = false;
                    this._jumpJumping = false;
                    this_up = false;
                } else {
                    // Dont collide, go up
                    if (this._up) {
                        this.clearLava();
                        this.y -= JUMPY;
                        this._jumpFalling = true;
                    }
                }
                // Spriting
                if (this._jumpFalling) {
                    if (this._jumpTimeFalling++ <= TIMEFALLING && this._jumpJumping) {
                        // Sprite salto
                    } else {
                        // Sprite caida
                    }
                }
                this._jumpJumping = false;
                this._jumpTimeFalling = 0;
                
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
                });
                this.bind("KeyDown", function () {
                    if (this.isDown("UP_ARROW")){
                        this._up = true;
                        Crafty.trigger("Moved", {x: this.x, y: this.y});
                    }
                });
            }
        });
    }
};

});