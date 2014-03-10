// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/mimic.js
// Author: Adam Barreiro
// Description: Multiplayer character component
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * mimic.js
 * @dependency /public/js/game/network/connector.js
 * @dependency /public/js/game/network/creator.js
 */
define (["../../../network/connector", "../../../network/creator"], function(Connector, Creator) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var TYPE;

/**
 * Function fired when we receive that the other player has moved.
 */
function onReceiveMovement() {
    switch(TYPE) {
        case "connector":
            Connector.onReceiveMovement(function(data) {
                Crafty("Multiplayer").x = data.x;
                Crafty("Multiplayer").y = data.y;
            });
            break;
        case "creator":
            Creator.onReceiveMovement(function(data) {
                Crafty("Multiplayer").x = data.x;
                Crafty("Multiplayer").y = data.y;
            });
            break;
        default: break;
    }
}

/**
 * Function fired when we receive a next level event.
 */
function onReceiveExit() {
    switch(TYPE) {
        case "connector":
            Connector.onReceiveExit(function(data) {
                Crafty('Character').stopAll();
                Scenes.nextLevel();
            });
            break;
        case "creator":
            Creator.onReceiveExit(function(data) {
                Crafty('Character').stopAll();
                Scenes.nextLevel();
            });
            break;
        default: break;
    }
}

/**
 * Function fired when we receive that the other player's dead.
 */
function onReceiveDeath() {
    switch(TYPE) {
        case "connector":
            Connector.onReceiveDeath(function(data) {
                this._health = 0;
                Crafty.audio.stop("level");
                Crafty.audio.stop("alert");
                Crafty.audio.stop("hidden");
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
            });
            break;
        case "creator":
            Creator.onReceiveDeath(function(data) {
                this._health = 0;
                Crafty.audio.stop("level");
                Crafty.audio.stop("alert");
                Crafty.audio.stop("hidden");
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
            });
            break;
        default: break;
    }
}

/**
 * Function fired when we receive that an enemy's been damaged
 */
function onReceiveEnemyDamage() {
    switch(TYPE) {
        case "connector":
            Connector.onReceiveEnemyDamage(function(data) {
                Crafty.audio.play("attack");
                Crafty.audio.play("monster_scream");
                data.enemy._enemyHealth = data.enemy._enemyHealth - d;
                if (data.enemy._enemyHealth > 0) {
                    $('#enemybar').css({"width": (data.enemy._enemyHealth*3) + "px"});
                } else {
                    // Erase enemy
                }
            });
            break;
        case "creator":
            Creator.onReceiveEnemyDamage(function(data) {
                Crafty.audio.play("attack");
                Crafty.audio.play("monster_scream");
                data.enemy._enemyHealth = data.enemy._enemyHealth - d;
                if (data.enemy._enemyHealth > 0) {
                    $('#enemybar').css({"width": (data.enemy._enemyHealth*3) + "px"});
                } else {
                    // Erase enemy
                }
            });
            break;
        default: break;
    }
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Creates the component.
     */
    createComponent: function(edition) {
        Crafty.c('Mimic', {
            /**
             * Function called to retransmit the damage of an enemy
             */
            multiplayerDamage: function(enemy,damage) {
                switch(TYPE) {
                    case "connector": Connector.sendEnemyDamage(enemy, damage); break;
                    case "creator": Creator.sendEnemyDamage(enemy, damage); break;
                    default: break;
                }
            },
            /**
             * Function called to retransmit the death of the character
             */
            multiplayerDeath: function() {
                switch(TYPE) {
                    case "connector": Connector.sendDeath(); break;
                    case "creator": Creator.sendDeath(); break;
                    default: break;
                }
            },
            /**
             * Function called to retransmit the next level event
             */
            multiplayerExit: function() {
                // Qué hacer si recibo un evento de salida: Parar todo, nextLevel
                switch(TYPE) {
                    case "connector": Connector.sendExit(); break;
                    case "creator": Creator.sendExit(); break;
                    default: break;
                }
            },
            /**
             * Function called to retransmit the character movement.
             */
            multiplayerMove: function() {
                switch(TYPE) {
                    case "connector":
                        this.bind("Moved", function() {
                            Connector.sendMovement(this.x, this.y);
                        });
                        break;
                    case "creator":
                        this.bind("Moved", function() {
                            Creator.sendMovement(this.x, this.y);
                        });
                        break;
                    default: break;
                }
            },
            /**
             * Starts the connector
             */
            connectorMode: function() {
                TYPE = "connector";
                onReceiveMovement();
                onReceiveExit();
                onReceiveDeath();
                onReceiveDamage();
                this.multiplayerMove();
            },
            /**
             * Starts the creator
             */
            creatorMode: function() {
                TYPE = "creator";
                onReceiveMovement();
                onReceiveExit();
                onReceiveDeath();
                onReceiveDamage();
                this.multiplayerMove();
            },
            init: function() {
                this.requires('Character');
            }
        });
    }
};

});