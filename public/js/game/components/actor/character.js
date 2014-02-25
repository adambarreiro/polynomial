// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character.js
// Author: Adam Barreiro
// Description: Character component
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * character.js
 * @dependency /public/js/game/components/actor/character/battle.js
 * @dependency /public/js/game/components/actor/character/bonus.js
 * @dependency /public/js/game/components/actor/character/camera.js
 * @dependency /public/js/game/components/actor/character/damage.js
 * @dependency /public/js/game/components/actor/character/detection.js
 * @dependency /public/js/game/components/actor/character/jump.js
 * @dependency /public/js/game/components/actor/character/lava.js
 * @dependency /public/js/game/components/actor/character/treasure.js
 */
define (["./character/battle","./character/bonus","./character/camera","./character/damage","./character/detection","./character/jump","./character/lava","./character/treasure"], function(Battle, Bonus, Camera, Damage, Detection, Jump, Lava, Treasure) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

/**
 * Registers all the child components.
 */
function createChildComponents(edition) {
    Battle.createComponent();
    Bonus.createComponent();
    Camera.createComponent();
    Damage.createComponent();
    Detection.createComponent();
    Jump.createComponent();
    Lava.createComponent();
    Treasure.createComponent();
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(edition) {
        Crafty.c('Character', {
            stopAll: function() {
                this.unbind("EnterFrame");
                this.unbind("Moved");
                this.unbind("KeyDown");
                Crafty("Enemy").each(function(){
                    this.unbind("Patrol");
                    this.unbind("EnterFrame");
                });
            },
            startAll: function() {
                this.gravity("Terrain").gravityConst(0.3);
                this.multiway(3, {
                    RIGHT_ARROW: 0,
                    LEFT_ARROW: 180
                });
                this.bind("KeyDown", function () {
                    if (this.isDown("A")) {
                        if (this._canAttack) {
                            if (!this._invisible) {
                                this.battle(true);
                            } else {
                                this.battle(false);
                            }
                        }
                    }
                    else if (this.isDown("S")) {
                        this.treasure();
                    }
                });
            },
            init: function() {
                this.requires('Actor, Collision, Gravity, Keyboard, Fourway, spr_char');
                this.z=2;
                if (!editing) {
                    this.startAll();
                }
            }
        });
        createChildComponents(edition);
    }
};

});