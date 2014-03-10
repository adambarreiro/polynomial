// -----------------------------------------------------------------------------
// Name: /public/js/game/components.js
// Author: Adam Barreiro
// Description: Loads the sprites and starts the god component Grid.
// Updated: 25-02-2014
// -----------------------------------------------------------------------------

/**
 * components.js
 * @dependency /public/js/game/components/grid.js
 */
define (["./components/grid"], function(Grid) {

var EDITOR = false;
var ROOT_ROUTE = "/assets/img/";
var EDITOR_ROUTE = "editor/";
var GAME_ROUTE = "game/";

function getEditor() {
    return EDITOR;
}

var EDITOR_ICONS = ['char.png', 'floor1.jpg', 'floor2.jpg','floor3.jpg','floor4.jpg',
                    'floor5.jpg','abyss.jpg','hide.png', 'chest.png','enemy1.png',
                    'enemy2.png','enemy3.png', 'enemy4.png','enemy5.png', 'exit.jpg'];
var GAME_ICONS = ['char.png', 'floor1.jpg', 'floor2.jpg','floor3.jpg','floor4.jpg',
                  'floor5.jpg','abyss.jpg','hide.png', 'chest.png','enemy1.png',
                  'enemy2.png','enemy3.png', 'enemy4.png','enemy5.png', 'exit.jpg',
                  'multiplayer.png',
                  'keys/delete.png','keys/minus.png','keys/enter.png', 'keys/number.png',
                  'keys/x.png', 'keys/plus.png'];

function loadEditorGraphics() {
    var ei = [];
    for (var i=0; i<EDITOR_ICONS.length; i++) {
        ei[i] = ROOT_ROUTE + EDITOR_ROUTE + EDITOR_ICONS[i];
    }
    Crafty.load(ei, function() {
        Crafty.sprite(32, ei[0], { spr_char: [0, 0] });
        Crafty.sprite(32, ei[1], { spr_floor1: [0, 0] });
        Crafty.sprite(32, ei[2], { spr_floor2: [0, 0] });
        Crafty.sprite(32, ei[3], { spr_floor3: [0, 0] });
        Crafty.sprite(32, ei[4], { spr_floor4: [0, 0] });
        Crafty.sprite(32, ei[5], { spr_floor5: [0, 0] });
        Crafty.sprite(32, ei[6], { spr_abyss: [0, 0] });
        Crafty.sprite(32, ei[7], { spr_hide: [0, 0] });
        Crafty.sprite(32, ei[8], { spr_chest: [0, 0] });
        Crafty.sprite(32, ei[9], { spr_enemy1: [0, 0] });
        Crafty.sprite(32, ei[10], { spr_enemy2: [0, 0] });
        Crafty.sprite(32, ei[11], { spr_enemy3: [0, 0] });
        Crafty.sprite(32, ei[12], { spr_enemy4: [0, 0] });
        Crafty.sprite(32, ei[13], { spr_enemy5: [0, 0] });
        Crafty.sprite(32, ei[14], { spr_exit: [0, 0] });
    });
}

function loadGameGraphics() {
    var gi = [];
    for (var i=0; i<GAME_ICONS.length; i++) {
        gi[i] = ROOT_ROUTE + GAME_ROUTE + GAME_ICONS[i];
    }
    Crafty.load(gi, function() {
        Crafty.sprite(24, 32, gi[0], { spr_char: [0, 0] });
        Crafty.sprite(32, 32, gi[1], { spr_floor1: [0, 0] });
        Crafty.sprite(32, 32, gi[2], { spr_floor2: [0, 0] });
        Crafty.sprite(32, 32, gi[3], { spr_floor3: [0, 0] });
        Crafty.sprite(32, 32, gi[4], { spr_floor4: [0, 0] });
        Crafty.sprite(32, 32, gi[5], { spr_floor5: [0, 0] });
        Crafty.sprite(32, 32, gi[6], { spr_abyss: [0, 0] });
        Crafty.sprite(32, 32, gi[7], { spr_hide: [0, 0] });
        Crafty.sprite(32, 32, gi[8], { spr_chest: [0, 0] });
        Crafty.sprite(32, 32, gi[9], { spr_enemy1: [0, 0] });
        Crafty.sprite(32, 32, gi[10], { spr_enemy2: [0, 0] });
        Crafty.sprite(32, 32, gi[11], { spr_enemy3: [0, 0] });
        Crafty.sprite(32, 32, gi[12], { spr_enemy4: [0, 0] });
        Crafty.sprite(32, 32, gi[13], { spr_enemy5: [0, 0] });
        Crafty.sprite(32, 32, gi[14], { spr_exit: [0, 0] });
        Crafty.sprite(24, 32, gi[15], { spr_multiplayer: [0, 0] });
    });
}

function loadSounds() {
    Crafty.audio.add("alert", "assets/music/alert.mp3");
    Crafty.audio.add("hidden", "assets/music/hidden.mp3");
    Crafty.audio.add("level", "assets/music/level.mp3");
    Crafty.audio.add("chest", "assets/sfx/chest.mp3");
    Crafty.audio.add("shield", "assets/sfx/shield.mp3");
    Crafty.audio.add("clock", "assets/sfx/clock.mp3");
    Crafty.audio.add("power", "assets/sfx/power.mp3");
    Crafty.audio.add("health", "assets/sfx/health.mp3");
    Crafty.audio.add("attack", "assets/sfx/attack.mp3");
    Crafty.audio.add("damage", "assets/sfx/damage.mp3");
    Crafty.audio.add("enemy_death", "assets/sfx/enemy_death.mp3");
    Crafty.audio.add("monster_scream", "assets/sfx/monster_scream.mp3");
}

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
function setComponents(edition) {
    if (edition) loadEditorGraphics();
    else {
        loadGameGraphics();
        loadSounds();
    }
    Grid.registerComponent(edition);
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the engine.
     */
    init: function() {
        setComponents(getEditor());
    },

    setEditor: function(editing){
        EDITOR = editing;
    },
};

});