// -----------------------------------------------------------------------------
// Name: /public/js/game/components/patrol.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------


define (function() {

function randOrientation() {
    if (Math.random() < 0.5) {
        return "right";
    } else {
        return "left";
    }
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the engine.
     */
    init: function(editing) {
        Crafty.c('Patrol', {
            _orientation: randOrientation(),
            _speed: 1,
            init: function() {
                if (!editing) {
                    this.requires('Enemy');
                    this.bind("EnterFrame", function(e) {
                        var pared;
                        var suelo;
                        if (this._orientation === "right") {
                            pared = Crafty.map.search({_x: this.x+32, _y: this.y, _w: 1, _h: 1}, true);
                            suelo = Crafty.map.search({_x: this.x+32, _y: this.y+32, _w: 1, _h: 1}, true);
                            if (pared.length > 0) {
                                if (pared[0].has("Terrain")) {
                                    this._orientation = "left";
                                } else {
                                    this.x += this._speed;
                                }
                            }
                            else if (suelo.length === 0) {
                                this._orientation = "left";
                            } else {
                                this.x += this._speed;
                            }
                        } else if (this._orientation === "left") {
                            pared = Crafty.map.search({_x: this.x-1, _y: this.y, _w: 1, _h: 1}, true);
                            suelo = Crafty.map.search({_x: this.x-32, _y: this.y+32, _w: 1, _h: 1}, true);
                            if (pared.length > 0) {
                                if (pared[0].has("Terrain")) {
                                    this._orientation = "right";
                                } else {
                                    this.x -= this._speed;
                                }
                            }
                            else if (suelo.length === 0) {
                                this._orientation = "right";
                            } else {
                                this.x -= this._speed;
                            }
                        }
                    });
                }
            }
        });
    },

};

});