// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["./constants", "./components/grid","./components/terrain", "./components/actor","./components/item"], function(Constants, Grid, Terrain, Actor, Item) {

var EDITOR = false;
function getEditor() {
    return EDITOR;
}

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
function setComponents() {
    Grid.registerComponents();
    Terrain.registerComponents();
    Item.registerComponents(getEditor());
    Actor.registerComponents(getEditor());
}

function setSprites() {
    Crafty.load(['/assets/img/char.png',
                 '/assets/img/floor1.jpg', '/assets/img/floor2.jpg',
                 '/assets/img/floor3.jpg','/assets/img/floor4.jpg',
                 '/assets/img/floor5.jpg','/assets/img/abyss.png',
                 '/assets/img/hide.png', '/assets/img/chest.png',
                 '/assets/img/enemy1.png', '/assets/img/enemy2.png',
                 '/assets/img/enemy3.png', '/assets/img/enemy4.png',
                 '/assets/img/enemy5.png', '/assets/img/exit.jpg'], function(){
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
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the engine.
     */
    init: function() {
        setSprites();
        setComponents();
    },

    setEditor: function(editing){
        EDITOR = editing;
    },
};

});