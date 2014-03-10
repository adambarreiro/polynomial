// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/enemy.js
// Author: Adam Barreiro Costa
// Description: Registers the enemy component
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

/**
 * enemy.js
 * @dependency /public/js/game/components/actor/enemy/enemy1.js
 * @dependency /public/js/game/components/actor/enemy/enemy2.js
 * @dependency /public/js/game/components/actor/enemy/enemy3.js
 * @dependency /public/js/game/components/actor/enemy/enemy4.js
 * @dependency /public/js/game/components/actor/enemy/enemy5.js
 * @dependency /public/js/game/components/actor/enemy/patrol.js
 */
define (["./enemy/enemy1", "./enemy/enemy2","./enemy/enemy3","./enemy/enemy4","./enemy/enemy5","./enemy/patrol"], function(Enemy1, Enemy2, Enemy3, Enemy4, Enemy5, Patrol) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var MIN_DAMAGE = 25;
var MAX_DAMAGE = 45;
var POWERUP_MIN_DAMAGE = 45;
var POWERUP_MAX_DAMAGE = 75;


/**
 * Registers all the child components.
 */
function createChildComponents(edition) {
    // Enemy + component
    Enemy1.registerComponent(edition);
    // Enemy - component
    Enemy2.registerComponent(edition);
    // Enemy * component
    Enemy3.registerComponent(edition);
    // Enemy (*) component
    Enemy4.registerComponent(edition);
    // Enemy / component
    Enemy5.registerComponent(edition);
    // Patrol component
    Patrol.registerComponent(edition);
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(edition) {
        Crafty.c('Enemy', {
            _enemyHealth: 100, // Health of the enemy
            /**
             * Sends the other player the amount of damage dealt to the enemy
             */
            multiplayerDamage: function(damage) {
                if (Crafty("Multiplayer").length > 0) {
                    Crafty("Character").multiplayerEnemyDamage(this, damage);
                }
            },
            /**
             * Substracts a random amount of life from the enemy's health.
             * @return boolean - If the enemy's dead it's true.
             */
            damage: function() {
                Crafty.audio.play("attack");
                Crafty.audio.play("monster_scream");
                var d;
                if (Crafty("Character")._power > 0) {
                    d = Math.floor(Math.random()*(POWERUP_MAX_DAMAGE-POWERUP_MIN_DAMAGE+1)+POWERUP_MIN_DAMAGE);
                    this._enemyHealth = this._enemyHealth - d;
                    Crafty("Character")._power--;
                    if (Crafty("Character")._power === 0) {
                        Crafty("Character").removeBonus("power");
                    }
                } else {
                    d = Math.floor(Math.random()*(MAX_DAMAGE-MIN_DAMAGE+1)+MIN_DAMAGE);
                    this._enemyHealth = this._enemyHealth - d;
                }
                
                if (this._enemyHealth > 0) {
                    $('#enemybar').css({"width": (this._enemyHealth*3) + "px"});
                    this.multiplayerDamage(d);
                    return false;
                } else {
                    Crafty.audio.play("enemy_death");
                    $($(".lifebox").children()[2]).hide();
                    $($(".lifebox").children()[3]).hide();
                    $('#enemybar').css({"width": "300px"});
                    Crafty("Character").getEnemy().destroy();
                    Crafty.audio.stop("battle");
                    Crafty.audio.play("level",-1);
                    return true;
                }
            },
            /**
             * Starts all the components attached and events.
             */
            startEnemy: function() {
                this.addComponent("Patrol");
            },
            /**
             * Stops all the components attached.
             */
            stopEnemy: function() {
                this.removeComponent("Patrol");
                this.unbind("EnterFrame");
            },
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Actor');
                this.z=5;
                if (!edition) {
                    this.gravity("Terrain").gravityConst(0.3);
                    this.startEnemy();
                }
            }
        });
        createChildComponents(edition);
    }
};
});