// -----------------------------------------------------------------------------
// Name: /public/js/game/components/lava.js
// Author: Adam Barreiro Costa
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

define (function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

// Taken from the documentation of Crafty.js
var drawLava = {
    maxParticles: 150,
    size: 18,
    sizeRandom: 4,
    speed: 1,
    speedRandom: 1.2,
    // Lifespan in frames
    lifeSpan: 29,
    lifeSpanRandom: 7,
    // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
    angle: 65,
    angleRandom: 34,
    startColour: [255, 131, 0, 1],
    startColourRandom: [48, 50, 45, 0],
    endColour: [245, 35, 0, 0],
    endColourRandom: [60, 60, 60, 0],
    // Only applies when fastMode is off, specifies how sharp the gradients are drawn
    sharpness: 20,
    sharpnessRandom: 10,
    // Random spread from origin
    spread: 10,
    // How many frames should this last
    duration: -1,
    // Will draw squares instead of circle gradients
    fastMode: false,
    gravity: { x: 0, y: 0.1 },
    // sensible values are 0-3
    jitter: 0
};


// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    createComponent: function(editing) {
        Crafty.c('Lava', {
            _lavaInterval: undefined,
            _suelo:
            init: function() {
                this.requires('2D, Canvas, SpriteAnimation, Collision, Grid, Gravity, Keyboard, Fourway, Damage, spr_char');
                this.bind("EnterFrame", function () {
                    var suelo = Crafty.map.search({_x: this.x+16, _y: this.y+32, _w: 1, _h: 1}, true);
                    if (suelo.length > 0) {
                        if (suelo[0].has("Abyss")) {
                            if (this._cronoLava === undefined) {
                                var particulas = 0;
                                this._cronoLava = setInterval( function() {
                                    Crafty.e("2D, Canvas, Particles").attr({"_x": Crafty("Char").x, "_y": Crafty("Char").y+16}).particles(drawLava);
                                    particulas++;
                                    Crafty("Char").damage("lava");                               
                                    if (particulas % 2 === 0) {
                                        Crafty('Particles').each(function() { this.destroy(); });
                                    }
                                }, 100);

                            }
                        } else {
                            this.clearLava();
                        }
                    }
                });
            },
            clearLava: function() {
                clearInterval(this._cronoLava);
                Crafty('Particles').each(function() { this.destroy(); });
                this._cronoLava = undefined;
            }
        });
    }
};

});