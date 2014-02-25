// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/jump.js
// Author: Adam Barreiro
// Description: Component for giving the character the ability to jump.
// Updated: 24-02-2013
// -----------------------------------------------------------------------------

define (function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var JUMPY = 7; // Pixels that the character will move with every jump
var TIMEFALLING = 20; // Time falling

/**
 * Determines if the character has hit with some object and returns the object
 * that made the hit.
 */
function hasHit(character) {
    // This is the gravity component from CraftyJS but inverted.
    var obj = false;
    var hit = false;
    var pos = character.pos();
    pos._y= pos._y-JUMPY;
    pos.x = pos._x;
    pos.y = pos._y;
    pos.w = pos._w;
    pos.h = pos._h;

    var q = Crafty.map.search(pos);
    var l = q.length;

    for (var i = 0; i < l; ++i) {
        obj = q[i];
        
        if (obj !== character && obj.has(character._anti) && obj.intersect(pos)) {
            hit = obj;
            break;
        }
    }
    return hit;
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the engine.
     */
    createComponent: function() {
        Crafty.c('Jump', {
            _jumpJumping: false,
            _jumpUp: false,
            _jumpFalling: false,
            _jumpHit: undefined,
            _jumpTimeFalling: 0,
            init: function() {
                this.requires('Lava');
                this.bind("EnterFrame", function () {
                    if (this.isDown(Crafty.keys.UP_ARROW)) {
                        this._jumpJumping = true;
                    }
                    this._hit = hasHit(this);
                    if (this._hit) {
                        this.y = this._hit._y + this._h; // Makes the character stop
                        this._jumpFalling = true;
                        this._jumpJumping = false;
                        this._jumpUp = false;
                    } else {
                        if (this._jumpUp) {
                            this.clearLava();
                            this.y -= JUMPY;
                            this._jumpFalling = true;
                        }
                    }
                    if (this._jumpFalling) {
                        if (this._jumpTimeFalling++ <= TIMEFALLING && this._jumpJumping) {
                            this._jumpJumping = false;
                            
                        }
                        else {

                        }
                        this._jumpJumping = false;
                        this._jumpTimeFalling = 0;
                    }
                });
                this.bind("KeyDown", function () {
                    if (this.isDown("UP_ARROW")){
                        this._jumpUp = true;
                        Crafty.trigger("Moved", {x: this.x, y: this.y});
                    }
                });
            }
        });
    }
};

});