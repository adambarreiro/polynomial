// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["../components","../constants", "require", "./engine"], function(Components, Constants, Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var SCROLL_SPEED = 32;
var CHARACTER_POS = null;
var ENTITIES = {'0': 0}; // Map of entities ID

function getScrollArea() {
    return SCROLL_AREA;
}

function getScrollSpeed() {
    return SCROLL_SPEED;
}

function getCharacterPos() {
    return CHARACTER_POS;
}

function setCharacterPos(characterPos) {
    CHARACTER_POS = characterPos;
}

function getEntity(x,y) {
    return ENTITIES[(x+y*Constants.getLevelSize('tiles').width).toString()];
}

function addEntity(type,x,y) {
    ENTITIES[(x+y*Constants.getLevelSize('tiles').width).toString()] = Crafty.e(type).at(x,y)[0];
}

function removeEntity(x,y) {
    Crafty(getEntity(x,y)).destroy();
    if (getCharacterPos() === x+y*Constants.getLevelSize('tiles').width) {
        setCharacterPos(null);
    }
    delete ENTITIES[(x+y*Constants.getLevelSize('tiles').width).toString()];
}

function emptyEntities() {
    ENTITIES = {'0': 0};
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the engine.
     */
    init: function() {
        var size = Constants.getViewportSize('px');
        Crafty.scene('Loading', function(){
            Crafty.e('2D, DOM, Text').attr({
                x: size.width/2,
                y: size.height/2,
                w: size.width })
            .text('Cargando...');
            
            Crafty.scene("Start");
        });
        Crafty.scene('Start', function(){
            Crafty.background("black");
        });
        Crafty.init(Constants.getLevelSize('px').width, Constants.getLevelSize('px').height);
        Crafty.canvas.init();
        Crafty.viewport.init(size.width,size.height);
        Crafty.viewport.x = 0;
        Crafty.viewport.y = 0;
        
        Crafty.scene("Loading");
    },

    drawTile: function(x,y,type) {
        switch(type) {
            case 1:
                if (getCharacterPos() === null) {
                    removeEntity(x,y); addEntity("Char",x,y);
                    setCharacterPos(x+y*Constants.getLevelSize('tiles').width);
                }
                break;
            case 2: removeEntity(x,y); addEntity("Floor1",x,y); break;
            case 3: removeEntity(x,y); addEntity("Floor2",x,y); break;
            case 4: removeEntity(x,y); addEntity("Floor3",x,y); break;
            case 5: removeEntity(x,y); addEntity("Floor4",x,y); break;
            case 6: removeEntity(x,y); addEntity("Floor5",x,y); break;
            case 7: removeEntity(x,y); addEntity("Abyss",x,y); break;
            case 8: removeEntity(x,y); addEntity("Hide",x,y); break;
            case 9: removeEntity(x,y); addEntity("Chest",x,y); break;
            case 10: removeEntity(x,y); addEntity("Enemy1",x,y); break;
            case 11: removeEntity(x,y); addEntity("Enemy2",x,y); break;
            case 12: removeEntity(x,y); addEntity("Enemy3",x,y); break;
            case 13: removeEntity(x,y); addEntity("Enemy4",x,y); break;
            case 14: removeEntity(x,y); addEntity("Enemy5",x,y); break;
            case 15: removeEntity(x,y); addEntity("Exit",x,y); break;
            default: removeEntity(x,y); break;
        }
    },

    clean: function(background) {
        Crafty.background(background || "url('/assets/img/backgrounds/wall" + (Math.floor(Math.random()*5)+1) + ".jpg') no-repeat");
        Crafty('obj').each(function() { this.destroy(); });
        emptyEntities();
        setCharacterPos(null);
    },

    getMousePosition: function(e, viewport) {
        if (viewport !== null) {
            return {
                x: Math.floor(
                    (e.pageX - $('#cr-stage').offset().left - viewport.x) / Constants.getTileSize('px').width
                ),
                y: Math.floor(
                    (e.pageY - $('#cr-stage').offset().top - viewport.y) / Constants.getTileSize('px').height
                )
            };
        } else {
            return {
                x: Math.floor(
                    (e.pageX - $('#cr-stage').offset().left) / Constants.getTileSize('px').width
                ),
                y: Math.floor(
                    (e.pageY - $('#cr-stage').offset().top) / Constants.getTileSize('px').height
                )
            };
        }
        
    },

    moveEditor: function(direction) {
        pos_x = -Math.floor(Crafty.viewport.x/Constants.getTileSize('px').width);
        pos_y = -Math.floor(Crafty.viewport.y/Constants.getTileSize('px').height);
        var x = pos_x;
        var y = pos_y;
        size = Constants.getViewportSize('tiles');
        switch(direction) {
            case "left":
                if (pos_x > 0) {
                    Crafty.viewport.scroll('_x', Crafty.viewport.x + getScrollSpeed());
                    $('#move_right').css({"background" : "#999999"});
                    $("#position").html(
                        "Moviendo<br/>" +
                        "X: " + (pos_x+1) + "/" + Constants.getLevelSize('tiles').width
                    );
                    return true;
                } else {
                    $("#position").html("");
                    return false;
                }
                break;
            case "right":
                if (pos_x < Constants.getLevelSize('tiles').width - size.width) {
                    $("#position").html(
                        "Moviendo<br/>" +
                        "X: " + (pos_x+size.width+1) + "/" + Constants.getLevelSize('tiles').width
                    );
                    Crafty.viewport.scroll('_x', Crafty.viewport.x - getScrollSpeed());
                    $('#move_left').css({"background" : "#999999"});
                    return true;
                } else {
                    $("#position").html("");
                    return false;
                }
                break;
            case "up":
                if (pos_y > 0) {
                    Crafty.viewport.scroll('_y', Crafty.viewport.y + getScrollSpeed());
                    $('#move_down').css({"background" : "#999999"});
                    $("#position").html(
                        "Moviendo<br/>" +
                        "Y: " + (pos_y+1) + "/" + Constants.getLevelSize('tiles').height
                    );
                    return true;
                } else {
                    $("#position").html("");
                    return false;
                }
                break;
            case "down":
                if (pos_y < Constants.getLevelSize('tiles').height - size.height) {
                    Crafty.viewport.scroll('_y', Crafty.viewport.y - getScrollSpeed());
                    $('#move_up').css({"background" : "#999999"});
                    $("#position").html(
                        "Moviendo<br/>" +
                        "Y: " + (pos_y+size.height+1) + "/" + Constants.getLevelSize('tiles').height
                    );
                    return true;
                } else {
                    $("#position").html("");
                    return false;
                }
                break;
        }

    },

    getTileset: function() {
        var set = [];
        i=1;
        for (var img in Crafty.assets) {
            set[i] = img;
            i++;
        }
        return set;
    }
};

});