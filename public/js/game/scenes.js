// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: Generates and handles all the game scenes.
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["./constants", "./audio" ,"./components", "./multi"], function(Constants, Audio, Components, Multi) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var CHARACTER;
var LEVEL;
var STUDENT;
var MULTI_INIT = false;
var SIZE = Constants.getViewportSize('px');

function setCharacter(entity) {
    CHARACTER = entity;
}

function getCharacter() {
    return CHARACTER;
}

function setLevel(level) {
    LEVEL = level;
}

function getLevel() {
    return LEVEL;
}

function setStudent(student) {
    STUDENT = student;
}

function getStudent() {
    return STUDENT;
}

/**
 * Makes an AJAX petition in order to load a level of the game.
 * @param number - Number of the level to load
 * @param callback(data) - Callback when the query finishes.
 */
function loadLevel(callback) {
    $.ajax({
        url: '/levelLoad',
        type: 'POST',
        dataType: 'json',
        data: {number: getLevel()},
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * Makes an AJAX petition in order to save a level of the game.
 * @param callback(data) - Callback when the query finishes.
 */
function saveGame(callback) {
    $.ajax({
        url: '/saveGame',
        type: 'POST',
        dataType: 'json',
        data: {student: getStudent(), level: getLevel()},
        success: function(data) {
            callback(data);
        }
    });
}

function drawTile(x,y,type) {
    switch (type) {
        default: break;
        case 1: setCharacter(Crafty.e("Character").at(x,y)); break;
        case 2: Crafty.e("Floor1").at(x,y);  break;
        case 3: Crafty.e("Floor2").at(x,y);  break;
        case 4: Crafty.e("Floor3").at(x,y);  break;
        case 5: Crafty.e("Floor4").at(x,y);  break;
        case 6: Crafty.e("Floor5").at(x,y);  break;
        case 7: Crafty.e("Abyss").at(x,y); break;
        case 8: Crafty.e("Hide").at(x,y);  break;
        case 9: Crafty.e("Chest").at(x,y); break;
        case 10: Crafty.e("Enemy1").at(x,y); break;
        case 11: Crafty.e("Enemy2").at(x,y); break;
        case 12: Crafty.e("Enemy3").at(x,y); break;
        case 13: Crafty.e("Enemy4").at(x,y); break;
        case 14: Crafty.e("Enemy5").at(x,y); break;
        case 15: Crafty.e("Exit").at(x,y); break;
    }
    
}

function clean(background) {
    Crafty('obj').each(function() { this.destroy(); });
    Crafty.background(background || "url('/assets/img/backgrounds/wall" + (Math.floor(Math.random()*5)+1) + ".jpg') no-repeat");
}

function drawLevel(data) {
    Multi.setEnemyTotal(0);
    var multi = Multi.getMultiplayer();
    for (var i in data.map) {
        x = Math.floor(parseInt(i,10) % Constants.getLevelSize('tiles').width);
        y = Math.floor(parseInt(i,10) / Constants.getLevelSize('tiles').width);
        type = data.map[i];
        drawTile(x,y,data.map[i]);
    }
    var pos;
    if (multi === "connector") {
        if (!MULTI_INIT) {
            MULTI_INIT = true;
            Crafty("Character").addComponent("Mimic").connectorMode();
        } else {
            Crafty("Character").addComponent("Mimic").restartMimic();
        }
        pos = Crafty("Character").getMultiPosition();
        Crafty.e("Multiplayer").at(pos[0],pos[1]);
    } else if (multi === "creator"){
        if (!MULTI_INIT) {
            MULTI_INIT = true;
            Crafty("Character").addComponent("Mimic").creatorMode();
        } else {
            Crafty("Character").addComponent("Mimic").restartMimic();
        }
        pos = Crafty("Character").getMultiPosition();
        Crafty.e("Multiplayer").at(pos[0],pos[1]);
    }
    if (Crafty("Multiplayer").length > 0) {
        Crafty("Character").multiplayerUpdateHealth(Multi.getEnemyTotal());
    }
    Crafty.viewport.centerOn(getCharacter(),0);
    Crafty.viewport.follow(getCharacter(), 0, 0);
    resizeController();
}

function resize() {
    SIZE = Constants.getViewportSize('px');
    Crafty.viewport.init(SIZE.width,SIZE.height);
    $('.bottom').css({'width': Constants.getViewportSize('px').width});
    $('canvas').remove();
    Crafty.canvas.init();
    Crafty.trigger("InvalidateViewport");
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


function initCrafty() {
    Crafty.init(Constants.getLevelSize('px').width, Constants.getLevelSize('px').height);
    Crafty.viewport.init(SIZE.width,SIZE.height);
    Crafty.canvas.init();
}

function drawElements() {
    var html = ['<div id="back">Salir</div>',
                '<div id="music" name="si">Sonido: SÍ</div>',
                '<div class="bottom">',
                    '<div class="lifebox">',
                        '<span id="vidatext">Vida</span><div class="bar"><div id="lifebar"></div></div>',
                        '<span hidden>Enemigo</span><div hidden class="bar"><div id="enemybar"></div></div>',
                    '</div>',
                    '<div class="alert">',
                        '<span id="alerttext">RADAR</span><div id="timeout">OK</div>',
                    '</div>',
                    '<div class="inventory">',
                        '<span>Bonus<br/></span>',
                    '</div>',
                '</div>'].join('\n');
    $('body').append(html);
    $('#back').on("click", function() {
        if (confirm("¿Quieres salir del juego?")) {
            clean();
            window.location = "/game";
        }
    });
    $('#music').on("click", function() {
        if ($('#music').attr("name") === "si") {
            $("#music").text("Sonido: NO");
            $('#music').attr("name", "no");
            Crafty.audio.mute();
        } else {
            $("#music").text("Sonido: SÍ");
            $('#music').attr("name", "si");
            Crafty.audio.unmute();
        }
    });
    $('.bottom').css({'width': Constants.getViewportSize('px').width});
}

function gameScene() {
    Crafty.scene("Game", function(data){
        drawLevel(data);
        drawElements();
        Audio.playLevel();
    });
}

function nextScene() {
    Crafty.scene("Next", function(data) {
            var html = ['<div class="popup">',
                '<div class="separator">¡NIVEL SUPERADO!</div>',
                '<p>Pulsa Siguiente para ir al siguiente nivel</p>',
                '<input class="button" type="button" value="Siguiente"/>',
            '</div>'].join('\n');
        Audio.stopLevel();
        $('.bottom').remove();
        $('#back').remove();
        $('#music').remove();
        $('#cr-stage').fadeOut(1000, function() {
            $('body').append(html);
            $('.button').on("click", function() {
                $('.popup').remove();
                clean();
                $('#cr-stage').show();
                Crafty.scene("Game",data);
            });
        });
    });
}

function endScene() {
    Crafty.scene("End", function() {
        var html = ['<div id="exp">',
                '<h1>¡Enhorabuena, destruiste a tus enemigos y saliste con vida!<br/>',
                '<p>Ahora eres un experto resolviendo polinomios :)</p>',
                '<input class="button" type="button" value="Volver al menu"/></div>',
                ].join('\n');
        $('body').append(html);
        $('h1').css({
            "text-align" : "center",
            "color" : "white",
            "border-bottom" : "solid 1px #999999",
            "line-height" : "150%",
            "padding" : "10px"
        });
        $('.button').css({
            "clear" : "both",
            "float" : "left",
            "margin-top": "50px",
            "margin-left" : "45%"});
        $('.button').on('click', function() {
            $('#exp').remove();
            Crafty.stop();
            $('#cr-stage').remove();
            window.location="/";
        });
    });
}

function deathScene() {
    Crafty.scene("Death", function(data) {
        var html = ['<div class="popup">',
            '<div class="separator">¡HAS MUERTO!</div>',
            '<p>¡Vuelve a intentarlo!</p>',
            '<input class="button" type="button" value="¡Venganza!"/>',
        '</div>'].join('\n');
        $('.bottom').remove();
        $('#back').remove();
        $('#music').remove();
        $('#cr-stage').fadeOut(1000, function() {
            $('body').append(html);
            $('.button').on("click", function() {
                $('.popup').remove();
                clean();
                $('#cr-stage').show();
                Crafty.scene("Game", data);
            });
        });
    });
}

function loadingScene() {
    Crafty.scene("Loading", function(data){
        var html = ['<div id="exp">',
                '<h1>Cargando...</h1>',
                '<div id="loading"><div id="progress"></div></div>',
                '<table><tr>',
                '<td class="ltuto"><img src="/assets/img/tutorial/tutorial1.jpg"/></td>',
                '</tr><tr>',
                '<td class="rtuto"><img src="/assets/img/tutorial/tutorial2.jpg"/></td>',
                '</tr><tr>',
                '<td class="ltuto"><img src="/assets/img/tutorial/tutorial3.jpg"/></td>',
                '</tr></table>'].join('\n');
        $('#cr-stage').hide();
        $('body').append(html);
        $('h1').css({"text-align":"center", "color":"white"});
        $('table').css({"width":"80%", "margin":"0px auto"});
        $('.ltuto').css({"margin-top":"30px","float":"left","box-shadow":"10px 10px 10px #111111"});
        $('.rtuto').css({"margin-top":"30px","float":"right","box-shadow":"10px 10px 10px #111111"});
        $('#loading').css({"margin":"0 auto","border":"1px solid #FFF","background-color":"#000","width":"500px","height":"10px","box-shadow":"10px 10px 10px #111111"});
        $('#progress').css({"border":"0px","background-color":"#999","width":"100px","height":"10px"});
        var assets = ['/assets/img/backgrounds/wall1.jpg',
                      '/assets/img/backgrounds/wall2.jpg',
                      '/assets/img/backgrounds/wall3.jpg',
                      '/assets/img/backgrounds/wall4.jpg',
                      '/assets/img/backgrounds/wall5.jpg'];
        var loaded = false;
        var i = 444;
        var interval = setInterval(function() {
            if (!loaded) {
                if (i === 999) i = 444;
                i=i+111;
                $('#progress').css({"background-color":"#"+i});

            } else {
                clearInterval(interval);
            }
        },100);
        var gi = Components.getGameGraphics();
        Audio.addAudio();
        assets.join(Audio.loadAudio());
        assets.join(gi);
        Crafty.load(assets,
        function() {
            loaded=true;
            Components.setGameGraphics(gi);
            $('#loading').remove();
            $("h1").text("¡Todo listo!");
            $('table').before('<div id="cont"><input class="button" type="button" value="¡Empezar!"/></div>');
            $('#cont').css({"margin": "0 auto", "text-align": "center"});
            $('.button').on("click", function() {
                $('#exp').remove();
                clean();
                $('#cr-stage').show();
                Crafty.scene('Game', data);
            });
        },
        function(e) {
            $("#progress").width(e.percent*5);
        });
    });
}

function initScenes() {
    gameScene();
    loadingScene();
    deathScene();
    endScene();
    nextScene();
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {

    newGame: function(student, level, multi) {
        setStudent(student);
        setLevel(level);
        Multi.setMultiplayer(multi);
        loadLevel(function(data) {
            initScenes();
            if (data.map) {
                initCrafty();
                if (multi === "connector") { // In multiplayer the connector doesn't save the game
                    Crafty.scene('Loading',data);
                } else {
                    saveGame(function(ok) {
                        Crafty.scene('Loading',data);
                    });
                }
            } else {
                Crafty.scene("End");
            }
        });
    },
    nextLevel: function(mode) {
        setLevel(getLevel()+1);
        loadLevel(function(data) {
            if (data.map) {
                if (Multi.getMultiplayer() === "connector") { // In multiplayer the connector doesn't save the game
                    Crafty.scene('Next',data);
                } else {
                    saveGame(function(ok) {
                        Crafty.scene('Next',data);
                    });
                }
            } else {
                Crafty.scene("End");
            }
        });
    },
    restartLevel: function() {
        loadLevel(function(data) {
            if (data.map) {
                Crafty.scene("Death",data);
            }
        });
    }
};

});