// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["./constants", "./components/patrol", "./components/char", "./components/exit", "./menu"], function(Constants, Patrol, Char, Exit, Menu) {

var EDITOR = false;
function getEditor() {
    return EDITOR;
}

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
function setComponents() {
    // Grid component
    Crafty.c('Grid', {
        init: function() {
            this.attr({
                w: Constants.getTileSize('px').width,
                h: Constants.getTileSize('px').height
            });
        },
        at: function(x, y) {
            if (x === undefined && y === undefined) {
                return {
                    x: this.x/Constants.getTileSize('px').width,
                    y: this.y/Constants.getTileSize('px').height,
                };
            } else {
                this.attr({
                    x: x * Constants.getTileSize('px').width,
                    y: y * Constants.getTileSize('px').height,
                });
            return this;
            }
        }
    });
    Crafty.c('Terrain', {
        init: function() {
            this.requires('2D, Canvas, Grid');
        }
    });
    Crafty.c('Abyss', {
        init: function() {
            this.requires('Canvas, Terrain, Color, spr_abyss');
            this.z=3;
        }
    });
    Crafty.c('Item', {
        init: function() {
            this.requires('2D, Canvas, Grid');
        }
    });
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
    Char.init(getEditor());
    Exit.init(getEditor());
    Crafty.c('Floor1', {
        init: function() {
            this.requires('Terrain, Color, Collision, spr_floor1');
        }
    });
    Crafty.c('Floor2', {
        init: function() {
            this.requires('Terrain, Color, spr_floor2');
        }
    });
    Crafty.c('Floor3', {
        init: function() {
            this.requires('Terrain, Color, spr_floor3');
        }
    });
    Crafty.c('Floor4', {
        init: function() {
            this.requires('Terrain, Color, spr_floor4');
        }
    });
    Crafty.c('Floor5', {
        init: function() {
            this.requires('Terrain, Color, spr_floor5');
        }
    });
    Crafty.c('Hide', {
        init: function() {
            this.requires('Item, Color, spr_hide');
            this.z=4;
        }
    });
    Crafty.c('Chest', {
        _opened: false,
        init: function() {
            this.requires('Item, Color, spr_chest');
            this.z=1;
        }
    });
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
        setComponents();
        setSprites();
    },

    setEditor: function(editing){
        EDITOR = editing;
    },
};

});