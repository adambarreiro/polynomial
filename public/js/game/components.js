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

function getEditor() {
    return EDITOR;
}

var EDITOR_ICONS = ['/assets/img/char.png',
             '/assets/img/floor1.jpg', '/assets/img/floor2.jpg',
             '/assets/img/floor3.jpg','/assets/img/floor4.jpg',
             '/assets/img/floor5.jpg','/assets/img/abyss.png',
             '/assets/img/hide.png', '/assets/img/chest.png',
             '/assets/img/enemy1.png', '/assets/img/enemy2.png',
             '/assets/img/enemy3.png', '/assets/img/enemy4.png',
             '/assets/img/enemy5.png', '/assets/img/exit.jpg'];
var GAME_ICONS = ['/assets/img/keys/delete.png','/assets/img/keys/minus.png',
            '/assets/img/keys/enter.png', '/assets/img/keys/number.png',
            '/assets/img/keys/x.png', '/assets/img/keys/plus.png'];
var SPRITES = [];


function loadEditorGraphics() {
    Crafty.load(EDITOR_ICONS.concat(GAME_ICONS).concat(SPRITES), function(){
        Crafty.sprite(28, 32, '/assets/img/char.png', {
            spr_char: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/floor1.jpg', {
            spr_floor1: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/floor2.jpg', {
            spr_floor2: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/floor3.jpg', {
            spr_floor3: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/floor4.jpg', {
            spr_floor4: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/floor5.jpg', {
            spr_floor5: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/abyss.png', {
            spr_abyss: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/hide.png', {
            spr_hide: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/chest.png', {
            spr_chest: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/enemy1.png', {
            spr_enemy1: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/enemy2.png', {
            spr_enemy2: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/enemy3.png', {
            spr_enemy3: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/enemy4.png', {
            spr_enemy4: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/enemy5.png', {
            spr_enemy5: [0, 0]
        });
        Crafty.sprite(32, '/assets/img/exit.jpg', {
            spr_exit: [0, 0]
        });
    });
}

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
function setComponents(edition) {
    if (edition) loadEditorGraphics();
    else loadEditorGraphics();
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