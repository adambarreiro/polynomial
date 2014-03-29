// -----------------------------------------------------------------------------
// Name: /public/js/game/components.js
// Author: Adam Barreiro
// Description: Loads the sprites and starts the god component Grid.
// -----------------------------------------------------------------------------

/**
 * components.js
 * @dependency /public/js/game/components/grid.js
 * @dependency /public/js/game/audio.js
 */
define (["./components/grid", "./audio"], function(Grid, Audio) {

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
                  'multiplayer.png'];

function setEditorSprites(ei) {
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
}

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
function setComponentsBeforeStart(edition) {
    if (edition) {
        loadEditorGraphics();
        Grid.registerComponent(edition);
    }
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    loadEditorGraphics: function(callback){
        var html = ['<div class="popup" id="loading">',
                        '<div class="separator">Cargando...</div>',
                        '<p>Por favor, espera...</p>',
                    '</div>'].join("\n");
        $('body').append(html);
        var ei = [];
        for (var i=0; i<EDITOR_ICONS.length; i++) {
            ei[i] = ROOT_ROUTE + EDITOR_ROUTE + EDITOR_ICONS[i];
        }
        Crafty.load(ei, function() {
            $("#loading").remove();
            setEditorSprites(ei);
            Grid.registerComponent(true);
            callback();
        });
    },
    getGameGraphics: function() {
        var gi = [];
        for (var i=0; i<GAME_ICONS.length; i++) {
            gi[i] = ROOT_ROUTE + GAME_ROUTE + GAME_ICONS[i];
        }
        return gi;
    },
    setGameGraphics: function(gi) {
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
        Grid.registerComponent(false);
    }
};

});