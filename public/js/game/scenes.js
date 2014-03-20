// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["./constants", "./audio" ,"require", "./scenes"], function(Constants, Audio, Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

var CHARACTER;
var LEVEL;
var STUDENT;
var MULTIPLAYER;
var ENEMYTOTAL = 0;
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

function getMultiplayer() {
    return MULTIPLAYER;
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

function updateSavegameCookie(level) {
    document.cookie = "savegame=" + level;
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
    ENEMYTOTAL = 0;
    var multi = getMultiplayer();
    for (var i in data.map) {
        x = Math.floor(parseInt(i,10) % Constants.getLevelSize('tiles').width);
        y = Math.floor(parseInt(i,10) / Constants.getLevelSize('tiles').width);
        type = data.map[i];
        drawTile(x,y,data.map[i]);
    }
    if (multi === "connector") {
        Crafty.e("Multiplayer").at(Crafty("Character").x/32,Crafty("Character").y/32);
        Crafty("Character").addComponent("Mimic").connectorMode();
    } else if (multi === "creator"){
        Crafty.e("Multiplayer").at(Crafty("Character").x/32,Crafty("Character").y/32);
        Crafty("Character").addComponent("Mimic").creatorMode();
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
    $("#cr-stage").css({"overflow": "visible"});
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
                '<p>Ahora eres un experto resolviendo polinomios : )</p>',
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

function explanationScene() {
    Crafty.scene("Explanation", function(data) {
        var html = ['<div id="exp">',
                '<h1>Fuiste designado a la lejana luna Europa en una expedición bélica...<br/>',
                'Algo salió mal...<br/>Miras a tu alrededor y sólo hay extrañas criaturas y ni rastro de tus compañeros...<br/>',
                'Es hora de luchar por sobrevivir.<br/>¡Vamos!</h1>',
                '<img src="/assets/img/controls.png"/>',
                '<p>Los enemigos pueden descubrirte. ¡Escóndete para atacar tranquilamente!</p>',
                '<p>Si te descubren, ¡empezará una cuenta atrás que podría destruirte!</p>',
                '<p>Sólo podrás atacar cuando estés lo suficientemente cerca, así que ten cuidado.</p>',
                '<p>Haz caso a tu radar. Si está en amarillo, será mejor que te escondas. Si está en verde estarás a salvo.</p>',
                '<input class="button" type="button" value="¡Empezar!"/></div>'].join('\n');
        $('#cr-stage').hide();
        $('body').append(html);
        $('h1').css({
            "text-align" : "center",
            "color" : "white",
            "border-bottom" : "solid 1px #999999",
            "line-height" : "150%",
            "padding" : "10px"
        });
        $('img').css({
            "float" : "left",
        });
        $('p').css({
            "color" : "white",
            "text-align" : "left",
            "margin-left" : "50%",
            "padding-top" : "20px",
        });
        $('.button').css({
            "clear" : "both",
            "float" : "left",
            "margin-left" : "45%"});
        $('.button').on('click', function() {
            $('#exp').remove();
            clean();
            $('#cr-stage').show();
            Crafty.scene("Game", data);
        });
    });
}

function loadingScene() {
    Crafty.scene("Loading", function(data){
        var html = ['<div class="popup">',
                '<div class="separator">Cargando...</div>',
                '<p>Cargando gráficos, música y sonidos.<br/>Por favor, espere.</p>',
            '</div>'].join('\n');
        var assets = ['/assets/img/controls.png',
                    '/assets/img/backgrounds/wall1.jpg',
                    '/assets/img/backgrounds/wall2.jpg',
                    '/assets/img/backgrounds/wall3.jpg',
                    '/assets/img/backgrounds/wall4.jpg',
                    '/assets/img/backgrounds/wall5.jpg'];
        assets.join(Audio.loadAudio());
        Crafty.load(assets, function() {
            $('.popup').remove();
            clean();
            if (getLevel() === 1) {
                Crafty.scene('Explanation', data);
            } else {
                Crafty.scene('Game', data);
            }
        });
        $('body').append(html);
    });
}

function initScenes() {
    gameScene();
    explanationScene();
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
        MULTIPLAYER = multi;
        loadLevel(function(data) {
            initScenes();
            if (data.map) {
                initCrafty();
                if (multi === "connector") { // In multiplayer the connector doesn't save the game
                    updateSavegameCookie(getLevel());
                    Crafty.scene('Loading',data);
                } else {
                    saveGame(function(ok) {
                        updateSavegameCookie(getLevel());
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
                if (getMultiplayer() === "connector") { // In multiplayer the connector doesn't save the game
                    updateSavegameCookie(getLevel());
                    Crafty.scene('Next',data);
                } else {
                    saveGame(function(ok) {
                        updateSavegameCookie(getLevel());
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
    },

    setMultiplayer: function(multiplayer) {
        MULTIPLAYER = multiplayer;
    },
    generateMultiplayerId: function() {
        ENEMYTOTAL++;
        return ENEMYTOTAL;
    }
};

});