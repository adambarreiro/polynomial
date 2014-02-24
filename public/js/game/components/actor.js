// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor.js
// Author: Adam Barreiro Costa
// Description: Registers all the actor components.
// Updated: 24-02-2014
// -----------------------------------------------------------------------------

/**
 * Actor.js
 * @dependency /public/js/game/components/patrol.js
 * @dependency /public/js/game/components/character.js
 */
define (["./patrol", "./character"], function(Patrol, Character) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

/**
 * Registers all the child components.
 */
function createChildComponents() {
    // Enemy component
    Crafty.c('Enemy', {
        _health: 100,
        startAll: function() {
            this.gravity("Terrain").gravityConst(0.3);
            this.addComponent("Patrol");
        },
        init: function() {
            this.requires('2D, Canvas, Gravity, Grid');
            this.z=5;
            if (!getEditor()) {
                this.startAll();
            }
        },
        damage: function() {
            this._health = this._health - Math.floor(Math.random()*(35-10+1)+10);
            if (this._health > 0) {
                $('#enemybar').css({"width": (this._health*3) + "px"});
                return false;
            } else {
                $($(".lifebox").children()[2]).hide();
                $($(".lifebox").children()[3]).hide();
                $('#enemybar').css({"width": "300px"});
                Crafty("Char")._enemy.destroy();
                return true;
            }
        }
    });
    Patrol.init(getEditor());
    Character.init(getEditor());
    Crafty.c('Enemy1', {
        init: function() {
            this.requires('Enemy, Color, spr_enemy1');
        }
    });
    Crafty.c('Enemy2', {
        init: function() {
            this.requires('Enemy, Color, spr_enemy2');
        }
    });
    Crafty.c('Enemy3', {
        init: function() {
            this.requires('Enemy, Color, spr_enemy3');
        }
    });
    Crafty.c('Enemy4', {
        init: function() {
            this.requires('Enemy, Color, spr_enemy4');
        }
    });
    Crafty.c('Enemy5', {
        init: function() {
            this.requires('Enemy, Color, spr_enemy5');
        }
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    /**
     * Registers the component into the game.
     */
    registerComponents: function() {
        Crafty.c('Actor', {
            /**
             * Inits the component
             */
            init: function() {
                this.requires('2D, Canvas, Color, Grid');
            }
        });
        createChildComponents();
    }
};
});