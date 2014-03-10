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
            multiplayerDeath: function() {
                if (Crafty("Multiplayer").length > 0) {
                    this.multiplayerDeath();
                }
            },
            /**
             * Hurts the character by some random amount.
             * @param cause - The cause of damage (lava or enemy)
             */
            damage: function(cause) {
                switch(cause) {
                    case "lava":
                        if (this._shield > 0) {
                            this._shield = this._shield-2;
                        } else {
                            this._health--;
                        }
                        break;
                    case "enemy":
                        Crafty.audio.play("monster_scream");
                        Crafty.audio.play("damage");
                        if (this._shield > 0) {
                            this._shield = this._shield - Math.floor(Math.random()*(MAX_DAMAGE_SHIELD-MIN_DAMAGE_SHIELD+1)+MIN_DAMAGE_SHIELD);
                        } else {
                            this._health = this._health - Math.floor(Math.random()*(MAX_DAMAGE_HEALTH-MIN_DAMAGE_HEALTH+1)+MIN_DAMAGE_HEALTH);
                        }
                        break;
                }
                if (this._shield <= 0) {
                    this._shield = 0;
                    $('#lifebar').css({"width": "300px", "background" : "rgb(50,200,50)"});
                    $('#vidatext').html("Vida:");
                    this.removeBonus("shield");
                }
                if (this._shield > 0) {
                    $('#lifebar').css({"width": (this._shield*3) + "px"});
                } else {
                    if (this._health > 0) {
                        $('#lifebar').css({"width": (this._health*3) + "px"});
                    } else {
                        this.die(cause);
                    }
                }
            },
            /**
             * Kills the character, restarting the game
             * @param cause - The cause of death (lava or enemy)
             */
            die: function(cause) {
                this._health = 0;
                Crafty.audio.stop("level");
                Crafty.audio.stop("alert");
                Crafty.audio.stop("hidden");
                this.multiplayerDeath();
                if (cause === "lava") {
                    this.clearLava();
                }
                if (cause === "enemy") {
                    this.stopAll();
                    this.clearBattle();
                }
                if ($(".battle").length > 0) $(".battle").remove();
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