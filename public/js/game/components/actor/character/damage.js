// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/damage.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * damage.js
 * @dependency /public/js/game/scenes.js
 * @dependency /public/js/game/audio.js
 */
define (["../../../audio", "require", "../../../scenes"], function(Audio, Require) {

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
                switch(cause) {
                    case "lava":
                        if (this._shield > 0) {
                            this._shield = this._shield-2;
                        } else {
                            this._health--;
                        }
                        break;
                    case "enemy":
                        if (this._shield > 0) {
                            this._shield = this._shield - Math.floor(Math.random()*(MAX_DAMAGE_SHIELD-MIN_DAMAGE_SHIELD+1)+MIN_DAMAGE_SHIELD);
                        } else {
                            this._health = this._health - Math.floor(Math.random()*(MAX_DAMAGE_HEALTH-MIN_DAMAGE_HEALTH+1)+MIN_DAMAGE_HEALTH);
                        }
                        break;
                }
                if (this._shield <= 0) {
                    this._shield = 0;
                    $('#lifebar').css({"width": (this._health*3) + "px", "background" : "rgb(50,200,50)"});
                    $('#vidatext').html("Vida:");
                    this.removeBonus("shield");
                }
                if (this._shield > 0) {
                    if (cause == "lava") {
                        if (this._shield % 20 === 0) {
                            Audio.playShield();
                        }
                    } else {
                        Audio.playShield();
                    }
                    $('#lifebar').css({"width": (this._shield*3) + "px"});
                } else {
                    if (this._health > 0) {
                        if (cause == "lava") {
                            if (this._health % 10 === 0) {
                                Audio.playDamage();
                            }
                        } else {
                            Audio.playDamage();
                        }
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
                Scenes = Require("../../../scenes");
                Audio.playCharDeath();
                this._health = 0;
                Audio.stopLevel();
                Audio.stopAlert();
                Audio.stopHidden();
                if (cause === "lava") {
                    this.clearLava();
                }
                if (cause === "enemy") {
                    this.clearBattle();
                }
                if ($(".battle").length > 0) $(".battle").remove();
                if (Crafty("Multiplayer").length > 0) {
                    this.restartMultiFlags();
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