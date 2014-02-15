// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/menu.js
// Author: Adam Barreiro
// Description: Draws the editor and sets all its functionalities.
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["../constants", "engine"], function(Constants, Engine) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var LOADEDLEVEL = null; // Loaded level
var NEWMAP = {}; // Current drawed map
var BRUSHES = null; // All the tile brushes
var BRUSH = 2; // Current brush
var PAINTING = false; // If the cursor has to paint when moving

/**
 * Returns the level currently loaded.
 * @return JSON - The level.
 */
function getLoadedLevel() {
    return LOADEDLEVEL;
}

/**
 * Sets if there is a map currently being edited.
 * @param level - The JSON of the level
 */
function setLoadedLevel(level) {
    LOADEDLEVEL = level;
}

/**
 * Returns the level currently loaded.
 * @return JSON - The level.
 */
function getNewMap() {
    return NEWMAP;
}

/**
 * Sets if there is a map currently being edited.
 * @param level - The JSON of the level
 */
function setNewMap(map) {
    NEWMAP = map;
}

function getBrushes() {
    return BRUSHES;
}


function setBrushes(brushes) {
    BRUSHES = brushes;
}

function getBrush() {
    return BRUSH;
}

function setBrush(brush) {
    BRUSH = brush;
}

function getPainting() {
    return PAINTING;
}

function setPainting(painting) {
    PAINTING = painting;
}

function drawTile(x,y,type) {
    if ((x >= 0 && x < Constants.getLevelSize('tiles').width) && (y >= 0 && y < Constants.getLevelSize('tiles').height)) {
        if (LOADEDLEVEL.map[(x+y*Constants.getLevelSize('tiles').width).toString()] !== type) {
            if (!NEWMAP[(x+y*Constants.getLevelSize('tiles').width).toString()] ||
                (NEWMAP[(x+y*Constants.getLevelSize('tiles').width).toString()] !== type)) {
                Engine.drawTile(x,y,getBrush());
                NEWMAP[(x+y*Constants.getLevelSize('tiles').width).toString()] = type;
            }
        }
    }
}

function drawLevel(level) {
    for (var i in level.map) {
        x = Math.floor(parseInt(i,10) % Constants.getLevelSize('tiles').width);
        y = Math.floor(parseInt(i,10)/Constants.getLevelSize('tiles').width);
        type = level.map[i];
        Engine.drawTile(x,y,level.map[i]);
        LOADEDLEVEL.map[(x+y*Constants.getLevelSize('tiles').width).toString()] = type;
    }
    var character = Crafty("Char");
    if ( character.length > 0) {
        console.log(character);
        Crafty.viewport.centerOn(character,0);
    } else {
        Crafty.viewport.x = 0;
        Crafty.viewport.y = 0;
    }
}

function resize() {
    var size = Constants.getViewportSize('px');
    $(".container").css({"width" : (window.innerWidth-40) + "px"});
    $(".scenario").css({"width" : (window.innerWidth-130) + "px"});
    Crafty.viewport.init(size.width,size.height);
    $(".moverh").css({"height" : size.height + "px", "line-height" : size.height + "px"});
    $(".moverv").css({"width" : size.width + "px"});
    $(".palette").css({"height" : (size.height + 20) + "px"});
    Crafty.DrawManager.renderCanvas();
}

function resizeController() {
    var resizeTimeOut = null;
    window.onresize = function() {
        if(resizeTimeOut !== null) clearTimeout(resizeTimeOut);
            resizeTimeOut = setTimeout(function() {
                resize();
        },10);
    };
}

function startDrawer() {
    var x, y;
    $('#cr-stage').bind("mousedown", function() {
        setPainting(true);
        $('#cr-stage').bind("mousemove", function(e) {
            if (getPainting()) {
                x = Engine.getMousePosition(e,Crafty.viewport).x;
                y = Engine.getMousePosition(e,Crafty.viewport).y;
                if (x < 0 ||
                    x >= Constants.getLevelSize('tiles').width ||
                    y < 0 ||
                    y >= Constants.getLevelSize('tiles').height) {
                    $('#position').html("&iexcl;Fuera de l&iacute;mites!").css({"color": "#FF0000"});
                } else {
                    $("#position").html(
                        "X: " + (x+1) + "/" + Constants.getLevelSize('tiles').width + "<br/>" +
                        "Y: " + (y+1) + "/" + Constants.getLevelSize('tiles').height
                    );
                    $('#position').css({"color": "#999999"});
                }
                drawTile(x,y,getBrush());
            }
            
        });
    })
    .bind('click', function() {
        drawTile(x,y,getBrush());
    })
    .bind('mousemove',function(e) {
        x = Engine.getMousePosition(e,Crafty.viewport).x;
        y = Engine.getMousePosition(e,Crafty.viewport).y;
        if (x < 0 ||
            x >= Constants.getLevelSize('tiles').width ||
            y < 0 ||
            y >= Constants.getLevelSize('tiles').height) {
            $('#position').html("&iexcl;Fuera de l&iacute;mites!").css({"color": "#FF0000"});
        } else {
            $("#position").html(
                "X: " + (x+1) + "/" + Constants.getLevelSize('tiles').width + "<br/>" +
                "Y: " + (y+1) + "/" + Constants.getLevelSize('tiles').height
            );
            $('#position').css({"color": "#999999"});
        }
    })
    .bind('mouseup',function() {
        setPainting(false);
    })
    .bind('mouseout', function() {
        $("#position").html("");
    });
    startMover();
}

function stopDrawer() {
    $('#cr-stage').unbind("mousedown click mousemove mouseup mouseout");
    $('body').unbind("keydown keyup");
    $('#move_left').unbind("hover");
    $('#move_up').unbind("hover");
    $('#move_down').unbind("hover");
    $('#move_right').unbind("hover");

}

function closePopup() {
    $('body').unbind('keyup');
    $('.popup').remove();
    $('.button').removeClass("deactivated");
    handler();
}

function cargando() {
    $('.popup').remove();
    var html = ['<div class="popup">',
                        '<div class="separator">Cargando...</div>',
                        '<p>Por favor, espere...</p>',
                    '</div>'].join('\n');
    $('.scenario').append(html);
}

/**
 * Makes an AJAX petition in order to obtain the amount of levels in the game.
 * @param callback(data) - Callback when the query finishes.
 */
function getLevelList(callback) {
    $.ajax({
        url: '/getLevelList',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * Makes an AJAX petition in order to create a new level in the game.
 * @param callback(data) - Callback when the query finishes.
 */
function createLevel(callback) {
    $.ajax({
        url: '/levelCreate',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * Makes an AJAX petition in order to modify a level in the game.
 * @param level - Level to update
 * @param map - Data to update
 * @param callback(data) - Callback when the query finishes.
 */
function updateLevel(level, map, callback) {
        $.ajax({
        url: '/levelUpdate',
        type: 'POST',
        dataType: 'json',
        data: {number: level.number, map: JSON.stringify(map)},
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * Makes an AJAX petition in order to load a level of the game.
 * @param number - Number of the level to load
 * @param callback(data) - Callback when the query finishes.
 */
function loadLevel(number, callback) {
    $.ajax({
        url: '/levelLoad',
        type: 'POST',
        dataType: 'json',
        data: {number: number},
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * Makes an AJAX petition in order to erase a level in the game.
 * @param number - Number of the level to delete
 * @param callback(data) - Callback when the query finishes.
 */
function deleteLevel(number, callback) {
    $.ajax({
        url: '/levelDelete',
        type: 'POST',
        dataType: 'json',
        data: {number: number},
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * Makes an AJAX petition in order to move a level in the game.
 * @param from - Number of the level which we're moving
 * @param to - Number of the level to we are moving.
 * @param callback(data) - Callback when the query finishes.
 */
function moveLevel(from, to, callback) {
    $.ajax({
        url: '/levelMove',
        type: 'POST',
        dataType: 'json',
        data: {from: from, to: to},
        success: function(data) {
            callback(data);
        }
    });
}



function startMover() {
    var intervalId;
    var up, left = false;
    var down, right = true;
    $('#move_left').css({"background" : "rgba(0,0,0,0.0)"});
    $('#move_up').css({"background" : "rgba(0,0,0,0.0)"});
    $('#move_right').bind("mousedown", function() {
        intervalId = window.setInterval(function() {
            right = Engine.moveEditor("right");
            if (right) $('#move_right').css({"background" : "#FFFFFF"});
            else $('#move_right').css({"background" : "rgba(0,0,0,0.0)"});
        }, 0.1);
    }).bind("mouseup mouseleave", function() {
        window.clearInterval(intervalId);
        if (right) $('#move_right').css({"background" : "#999999"});
    });
    $('#move_left').bind("mousedown", function() {
        intervalId = window.setInterval(function() {
            left = Engine.moveEditor("left");
            if (left) $('#move_left').css({"background" : "#FFFFFF"});
            else $('#move_left').css({"background" : "rgba(0,0,0,0.0)"});
        }, 0.1);
    }).bind("mouseup mouseleave", function() {
        window.clearInterval(intervalId);
        if (left) $('#move_left').css({"background" : "#999999"});
    });
    $('#move_up').bind("mousedown", function() {
        intervalId = window.setInterval(function() {
            up = Engine.moveEditor("up");
            if (up) $('#move_up').css({"background" : "#FFFFFF"});
            else $('#move_up').css({"background" : "rgba(0,0,0,0.0)"});
        }, 0.1);
    }).bind("mouseup mouseleave", function() {
        window.clearInterval(intervalId);
        if (up) $('#move_up').css({"background" : "#999999"});
    });
    $('#move_down').bind("mousedown", function() {
        intervalId = window.setInterval(function() {
            down = Engine.moveEditor("down");
            if (down) $('#move_down').css({"background" : "#FFFFFF"});
            else $('#move_down').css({"background" : "rgba(0,0,0,0.0)"});
        }, 0.1);
    }).bind("mouseup mouseleave", function() {
        window.clearInterval(intervalId);
        if (down) $('#move_down').css({"background" : "#999999"});
    });
    $('body').on('keydown', function(e) {
        switch (e.keyCode || e.which) {
            case 65:
                $('#move_left').css({"background" : "#FFFFFF"});
                left = Engine.moveEditor("left");
                if (!left) $('#move_left').css({"background" : "rgba(0,0,0,0.0)"});
                else $('#move_left').css({"background" : "#999999"});
                break;
            case 87:
                $('#move_up').css({"background" : "#FFFFFF"});
                up = Engine.moveEditor("up");
                if (!up) $('#move_up').css({"background" : "rgba(0,0,0,0.0)"});
                else $('#move_up').css({"background" : "#999999"});
                break;
            case 68:
                $('#move_right').css({"background" : "#FFFFFF"});
                right = Engine.moveEditor("right");
                if (!right) $('#move_right').css({"background" : "rgba(0,0,0,0.0)"});
                else $('#move_right').css({"background" : "#999999"});
                break;
            case 83:
                $('#move_down').css({"background" : "#FFFFFF"});
                down = Engine.moveEditor("down");
                if (!down) $('#move_down').css({"background" : "rgba(0,0,0,0.0)"});
                else $('#move_down').css({"background" : "#999999"});
                break;
        }
    }).on('keyup', function(e) {
        switch (e.keyCode || e.which) {
            case 65:
                if (!left) $('#move_left').css({"background" : "rgba(0,0,0,0.0)"});
                else $('#move_left').css({"background" : "#999999"});
                break;
            case 87:
                if (!up) $('#move_up').css({"background" : "rgba(0,0,0,0.2)"});
                else $('#move_up').css({"background" : "#999999"});
                break;
            case 68:
                if (!right) $('#move_right').css({"background" : "rgba(0,0,0,0.0)"});
                else $('#move_right').css({"background" : "#999999"});
                break;
            case 83:
                if (!down) $('#move_down').css({"background" : "rgba(0,0,0,0.0)"});
                else $('#move_down').css({"background" : "#999999"});
                break;
        }
        
    });
}

function startBrushes() {
    if (getBrushes() === null) {
        setBrushes(Engine.getTileset());
        brushes = getBrushes();
        $(".palette").append('<li id="brush_00"></li>');
        $("#brush_00").css( {"background-image" : "url(/assets/img/clean.jpg)"});
        for (i=1; i<brushes.length; i++) {
            if (i < 10) {
                $(".palette").append('<li id="brush_0'+ i +'"></li>');
                $("#brush_0" + i).css( {"background-image" : "url(" + brushes[i] + ")"});
                }
            else {
                $(".palette").append('<li id="brush_'+ i +'"></li>');
                $("#brush_" + i).css( {"background-image" : "url(" + brushes[i] + ")"});
            }
            
        }
        $(".palette").children().each(function() {
            $(this).bind("click",function() {
                var brush = $(this).attr('id');
                setBrush(parseInt(brush.substr(brush.length-2,brush.length),10));
            });
        });

    }
}

/**
 * Displays a popup with options to create a new level.
 * @param number - Number of levels already set in the database.
 */
function popupNewLevel() {
    if (getLoadedLevel() === null) {
        createLevel(function(data) {
            $(".name").val("Nivel " + data.number);
            setLoadedLevel(data);
            setNewMap({});
            Engine.clean();
            startBrushes();
            startDrawer();
            closePopup();
        });
    } else {
        $('.button').unbind('click').removeClass().addClass("button deactivated");
        var html = ['<div class="popup" name="popupNew">',
                        '<div class="separator">Nuevo nivel</div>',
                        '<p>&iquest;Deseas crear un nivel nuevo?<br/>Esto descartar&aacute; los cambios actuales.</p>',
                        '<input class="button" type="button" name="back2" value="Atr&aacute;s"/>',
                        '<input class="button" type="button" value="Aceptar"/>',
                    '</div>'].join('\n');
        $('.scenario').append(html);
        $('body').bind('keyup', function(e) {
            if ((e.keyCode || e.which) == 13) {
                cargando();
                createLevel(function(data) {
                    $(".name").val("Nivel " + data.number);
                    setLoadedLevel(data);
                    setNewMap({});
                    Engine.clean();
                    startBrushes();
                    startDrawer();
                    closePopup();
                });
            } else if ((e.keyCode || e.which) == 27) {
                closePopup();
            }
        });
        $('input[name="back2"]').bind('click',function() {
            closePopup();
        });
        $('input[value="Aceptar"]').bind('click',function() {
            cargando();
            createLevel(function(data) {
                $(".name").val("Nivel " + data.number);
                setLoadedLevel(data);
                setNewMap({});
                Engine.clean();
                startBrushes();
                startDrawer();
                closePopup();
            });
        });
    }
}

/**
 * Displays a popup with options to save a level.
 * @param number - Number of levels already set in the database.
 */
function popupSaveLevel(levelList) {
    $('.button').unbind('click').removeClass().addClass("button deactivated");
    var html = ['<div class="popup" name="popupSave">',
                    '<div class="separator">Guardar nivel</div>',
                    '<p>&iquest;Deseas sobreescribir el nivel '+ getLoadedLevel().number +'?</p>',
                    '<input class="button" type="button" name="back2" value="Atr&aacute;s"/>',
                    '<input class="button" type="button" value="Aceptar"/>',
                '</div>'].join('\n');
    $('.scenario').append(html);
    $('body').bind('keyup', function(e) {
        if ((e.keyCode || e.which) == 13) {
            cargando();
            updateLevel(getLoadedLevel(), getNewMap(), function(error) {
                $.extend(getLoadedLevel(), getLoadedLevel(), getNewMap());
                setNewMap({});
                closePopup();
            });
        } else if ((e.keyCode || e.which) == 27) {
            closePopup();
        }
    });
    $('input[name="back2"]').bind('click',function() {
        closePopup();
    });
    $('input[value="Aceptar"]').bind('click',function() {
        cargando();
        updateLevel(getLoadedLevel(), getNewMap(), function(data) {
            $.extend(getLoadedLevel(), getLoadedLevel(), getNewMap());
            setNewMap({});
            closePopup();
        });
    });
}

/**
 * Displays a popup with options to load an existent level.
 */
function popupLoadLevel(levelList) {
    $('.button').unbind('click').removeClass().addClass("button deactivated");
    var html = ['<div class="popup" name="popupLoad">',
                    '<div class="separator">Cargar nivel</div>',
                    '<p>&iquest;Qu&eacute; nivel quieres cargar?<br/>Perder&aacute;s los cambios no guardados.</p>',
                    '<select name="level" class="popupelement"><option value="">Selecciona el nivel</option></select>',
                    '<input class="button" type="button" name="back2" value="Atr&aacute;s"/>',
                    '<input class="button" type="button" value="Aceptar"/>',
                '</div>'].join('\n');
    $('.scenario').append(html);
    for (i=0; i <levelList.length; i++) {
        $('select[name="level"]').append('<option value="'+ levelList[i].number +'">Nivel ' + levelList[i].number + '</option>');
    }
    $('body').bind('keyup', function(e) {
        if ((e.keyCode || e.which) == 13) {
            var l = $('select[name="level"]').val();
            cargando();
            loadLevel(l, function(data) {
                $(".name").val("Nivel " + data.number);
                setLoadedLevel(data);
                setNewMap({});
                Engine.clean();
                drawLevel(data);
                startBrushes();
                startDrawer();
                closePopup();
            });
        } else if ((e.keyCode || e.which) == 27) {
            closePopup();
        }
    });
    $('input[name="back2"]').bind('click',function() {
        closePopup();
    });
    $('input[value="Aceptar"]').bind('click',function() {
        var l = $('select[name="level"]').val();
        cargando();
        loadLevel(l, function(data) {
            $(".name").val("Nivel " + data.number);
            setLoadedLevel(data);
            setNewMap({});
            Engine.clean();
            drawLevel(data);
            startBrushes();
            startDrawer();
            closePopup();
        });
    });
}

/**
 * Displays a popup with options to delete an existent level.
 */
function popupDeleteLevel(levelList) {
    $('.button').unbind('click').removeClass().addClass("button deactivated");
    var html = ['<div class="popup" name="popupDelete">',
                    '<div class="separator">Borrar nivel</div>',
                    '<p>&iquest;Qu&eacute; nivel quieres eliminar?<br/>La operaci&oacute;n no se puede deshacer.</p>',
                    '<select name="level" class="popupelement"><option value="">Selecciona el nivel</option></select>',
                    '<p>Aviso: Los niveles se reordenar&aacute;n, por lo que el nivel actual se cerrará.</p>',
                    '<input class="button" type="button" name="back2" value="Atr&aacute;s"/>',
                    '<input class="button" type="button" value="Aceptar"/>',
                '</div>'].join('\n');
    $('.scenario').append(html);
    for (i=0; i <levelList.length; i++) {
        $('select[name="level"]').append('<option value="'+ levelList[i].number +'">Nivel ' + levelList[i].number + '</option>');
    }
    $('body').bind('keyup', function(e) {
        if ((e.keyCode || e.which) == 13) {
            var l = $('select[name="level"]').val();
            cargando();
            deleteLevel(l, function(data) {
                if (getLoadedLevel() !== null) {
                    $(".name").val("Ningun mapa cargado");
                    setLoadedLevel(null);
                    setNewMap({});
                    Engine.clean("black");
                    stopDrawer();
                }
                closePopup();
            });
        } else if ((e.keyCode || e.which) == 27) {
            closePopup();
        }
    });
    $('input[name="back2"]').bind('click',function() {
        closePopup();
    });
    $('input[value="Aceptar"]').bind('click',function() {
        var l = $('select[name="level"]').val();
        cargando();
        deleteLevel(l, function(data) {
            if (getLoadedLevel() !== null) {
                $(".name").val("Ningun mapa cargado");
                setLoadedLevel(null);
                setNewMap({});
                Engine.clean("black");
                stopDrawer();
            }
            closePopup();
        });
    });
}

/**
 * Displays a popup with options to move an existent level.
 */
function popupMoveLevel(levelList) {
    $('.button').unbind('click').removeClass().addClass("button deactivated");
    var html = ['<div class="popup" name="popupMove">',
                    '<div class="separator">Intercambiar nivel</div>',
                    '<p>Intercambia las posiciones entre:</p>',
                    '<select name="from" class="popupelement"><option value="">Selecciona el nivel</option></select>',
                    '<p>y el siguiente nivel:</p>',
                    '<select name="to" class="popupelement"><option value="">Selecciona el nivel</option></select>',
                    '<p>(Si est&aacute;n abiertos ahora, perder&aacute;s los cambios)</p>',
                    '<input class="button" type="button" name="back2" value="Atr&aacute;s"/>',
                    '<input class="button" type="button" value="Aceptar"/>',
                '</div>'].join('\n');
    $('.scenario').append(html);
    for (i=0; i <levelList.length; i++) {
        $('select').append('<option value="'+ levelList[i].number +'">Nivel ' + levelList[i].number + '</option>');
    }
    $('.scenario').bind('keyup', function(e) {
        if ((e.keyCode || e.which) == 13) {
            var l1 = $('select[name="from"]').val();
            var l2 = $('select[name="to"]').val();
            cargando();
            moveLevel(l1, l2, function(data) {
                if (getLoadedLevel() !== null) {
                    if (l1 == getLoadedLevel().number || l2 == getLoadedLevel().number) {
                        $(".name").val("Ningun mapa cargado");
                        setLoadedLevel(null);
                        setNewMap({});
                        Engine.clean("black");
                        stopDrawer();
                    }
                }
                closePopup();
            });
        } else if ((e.keyCode || e.which) == 27) {
            closePopup();
        }
    });
    $('input[name="back2"]').bind('click',function() {
        closePopup();
    });
    $('input[value="Aceptar"]').bind('click',function() {
        var l1 = $('select[name="from"]').val();
        var l2 = $('select[name="to"]').val();
        cargando();
        moveLevel(l1, l2, function(data) {
            if (getLoadedLevel() !== null) {
                if (l1 == getLoadedLevel().number || l2 == getLoadedLevel().number) {
                    $(".name").val("Ningun mapa cargado");
                    setLoadedLevel(null);
                    setNewMap({});
                    Engine.clean("black");
                    stopDrawer();
                }
            }
            closePopup();
        });
    });
}

/**
 * Sets the behaviour for all the buttons in the editor menu.
 */
function handler() {
    getLevelList(function(levelList) {
        $('input[name="new"]').bind('click',function() {
            popupNewLevel();
        });
        if (levelList.length > 0) {
            $('input[name="load"]').bind('click',function() {
                popupLoadLevel(levelList);
            });
            $('input[name="move"]').bind('click',function() {
                popupMoveLevel(levelList);
            });
            $('input[name="delete"]').bind('click',function() {
                popupDeleteLevel(levelList);
            });
        } else {
            $('input[name="load"]').toggleClass('deactivated');
            $('input[name="move"]').toggleClass('deactivated');
            $('input[name="delete"]').toggleClass('deactivated');
        }
        if (getLoadedLevel() !== null) {
            $('input[name="save"]').bind('click',function() {
                popupSaveLevel();
            });
        } else {
            $('input[name="save"]').toggleClass('deactivated');
        }
    });
    $('input[name="back"]').bind('click',function() {
        window.location = "/admin";
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the editor.
     */
    init: function() {
        resizeController();
        resize();
        handler();
    }
};

});