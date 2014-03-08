// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/damage.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * damage.js
 * @dependency /public/js/game/scenes.js
 */
define (["../../../scenes"], function(Scenes) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var MAX_DAMAGE_SHIELD = 55;
var MIN_DAMAGE_SHIELD = 30;
var MAX_DAMAGE_HEALTH = 10;
var MIN_DAMAGE_HEALTH = 15;

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Creates the component
     */
    createComponent: function() {
        Crafty.c('Damage', {
            /**
             * Hurts the character by some random amount.
             * @param cause - The cause of damage (lava or enemy)
             */
            damage: function(cause) {
                var shield = this._shield;
                var health = this._health;
                switch(cause) {
                    case "lava":
                        if (shield > 0) {
                            shield = shield-2;
                        } else {
                            health--;
                        }
                        break;
                    case "enemy":
                        if (shield > 0) {
                            shield = shield - Math.floor(Math.random()*(MAX_DAMAGE_SHIELD-MIN_DAMAGE_SHIELD+1)+MIN_DAMAGE_SHIELD);
                        } else {
                            health = health - Math.floor(Math.random()*(MAX_DAMAGE_HEALTH-MIN_DAMAGE_HEALTH+1)+MIN_DAMAGE_HEALTH);
                        }
                        break;
                }
                if (shield <= 0) {
                    shield = 0;
                    $('#lifebar').css({"width": "300px", "background" : "rgb(50,200,50)"});
                    $('#vidatext').html("Vida:");
                    this.removeBonus("shield");
                }
                if (shield > 0) {
                    $('#lifebar').css({"width": (shield*3) + "px"});
                } else {
                    if (health > 0) {
                        $('#lifebar').css({"width": (health*3) + "px"});
                    } else {
                        this.die(cause);
                    }
                }
                this._shield = shield;
                this._health = health;
            },
            /**
             * Kills the character, restarting the game
             * @param cause - The cause of death (lava or enemy)
             */
            die: function(cause) {
                this._health = 0;
                if (cause === "lava") {
                    this.clearLava();
                }
                if (cause === "enemy") {
                    this.stopAll();
                    this.clearBattle();
                }
                Crafty('obj').each(function() { this.destroy(); });
                Scenes.restartLevel();
            },
            /**
             * Inits component
             */
            init: function() {
                this.requires("Lava, Battle");
            }
        });
    }
};

});