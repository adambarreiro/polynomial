// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/lava.js
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
    maxParticles: 2,
    size: 18,
    sizeRandom: 4,
    speed: 1,
    speedRandom: 1.2,
    lifeSpan: 20,
    lifeSpanRandom: 7,
    angle: 65,
    angleRandom: 34,
    startColour: [255, 131, 0, 1],
    startColourRandom: [48, 50, 45, 0],
    endColour: [245, 35, 0, 0],
    endColourRandom: [60, 60, 60, 0],
    sharpness: 20,
    sharpnessRandom: 10,
    spread: 10,
    duration: -1,
    fastMode: true,
    gravity: { x: 0, y: 0.1 },
    jitter: 0
};

var LAVA_MAX = 2; // CAUTION: Incresing this parameter means CPU usage to the max.


// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Creates the component.
     */
    createComponent: function(editing) {
        Crafty.c('Lava', {
            _lavaInterval: undefined,
            _lavaFloor: undefined,
            _lavaParticles: 0,
            /**
             * Draws the lava and controls the damage.
             */
            lava: function() {
                this._lavaFloor = Crafty.map.search({_x: this.x+16, _y: this.y+32, _w: 1, _h: 1}, true);
                if (this._lavaFloor.length > 0) {
                    if (this._lavaFloor[0].has("Abyss")) {
                        if (this._lavaInterval === undefined) {
                            this._lavaParticles = 0;
                            this._lavaInterval = setInterval( function() {
                                //Crafty.e("2D, Canvas, Particles").attr({"_x": Crafty("Character").x, "_y": Crafty("Character").y+16}).particles(drawLava);
                                Crafty("Character")._lavaParticles++;
                                Crafty("Character").damage("lava");
                                if (Crafty("Character")._lavaParticles % LAVA_MAX === 0) {
                                    Crafty.audio.play("damage");
                                    Crafty('Particles').each(function() { this.destroy(); });
                                }
                            }, 100);

                        }
                    } else {
                        this.clearLava();
                    }
                }
            },
            /**
             * Clear the lava effects.
             */
            clearLava: function() {
                clearInterval(this._lavaInterval);
                Crafty('Particles').each(function() { this.destroy(); });
                this._lavaInterval = undefined;
            },
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Damage');
                this.bind("EnterFrame", function () {
                    this.lava();
                });
                this.bind('Moved', function() {
                    this.lava();
                });
            }
        });
    }
};

});