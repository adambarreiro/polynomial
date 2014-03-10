// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["./constants", "require", "./scenes"], function(Constants, Require) {

var CHARACTER;
var QUESTIONS;
var ANSWERS;
var LEVEL;
var STUDENT;
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
 * Makes an AJAX petition in order to save a level of the game.
 * @param number - Number of the level to load
 * @param callback(data) - Callback when the query finishes.
 */
function saveGame(student, level, callback) {
    $.ajax({
        url: '/saveGame',
        type: 'POST',
        dataType: 'json',
        data: {student: student, level: level},
        success: function(data) {
            callback(data);
        }
    });
}

function updateSavegameCookie(level) {
    document.cookie = "savegame=" + level;
}

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
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

function drawLevel(level, mode) {
    for (var i in level.map) {
        x = Math.floor(parseInt(i,10) % Constants.getLevelSize('tiles').width);
        y = Math.floor(parseInt(i,10) / Constants.getLevelSize('tiles').width);
        type = level.map[i];
        drawTile(x,y,level.map[i],mode);
    }
    if (mode !== undefined) {
        Crafty.e("Multiplayer").at(Crafty("Character").x/32,Crafty("Character").y/32);
        if (mode.connector) {
            Crafty("Character").addComponent("Mimic").connectorMode();
        } else {
            Crafty("Character").addComponent("Mimic").creatorMode();
        }
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

function gameScene(name, level, mode) {
    Crafty.scene(name, function(){
        drawLevel(level,mode);
        drawElements();
        Crafty.audio.play("level",-1);
    });
}

function endScene(name) {
    var html = ['<div id="exp">',
                '<h1>¡Enhorabuena, destruiste a tus enemigos y saliste con vida!<br/>',
                '<p>Ahora eres un experto resolviendo polinomios : )</p>',
                '<input class="button" type="button" value="Volver al menu"/></div>',
                ].join('\n');
    Crafty.scene(name, function() {
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
            window.location="/";
            $('#cr-stage').remove();
        });
    });
}

function loadingScene(name, callbackScene) {
    var html = ['<div class="popup">',
                    '<div class="separator">Cargando...</div>',
                    '<p>Cargando gráficos, música y sonidos.<br/>Por favor, espere.</p>',
                '</div>'].join('\n');
    Crafty.scene(name, function(){
        Crafty.load(['/assets/img/controls.png',
                    '/assets/img/backgrounds/wall1.jpg',
                    '/assets/img/backgrounds/wall2.jpg',
                    '/assets/img/backgrounds/wall3.jpg',
                    '/assets/img/backgrounds/wall4.jpg',
                    '/assets/img/backgrounds/wall5.jpg',
                    '/assets/music/alert.mp3',
                    '/assets/music/hidden.mp3',
                    '/assets/music/level.mp3',
                    '/assets/sfx/attack.mp3',
                    '/assets/sfx/chest.mp3',
                    '/assets/sfx/clock.mp3',
                    '/assets/sfx/damage.mp3',
                    '/assets/sfx/enemy_death.mp3',
                    '/assets/sfx/health.mp3',
                    '/assets/sfx/monster_scream.mp3',
                    '/assets/sfx/power.mp3',
                    '/assets/sfx/shield.mp3',
                    ], function() {
            clean();
            Crafty.scene(callbackScene);
        });
        Crafty.e('2D, DOM, HTML').attr({
            x: SIZE.width/2,
            y: SIZE.height/2})
        .append(html);
    });
}


function deathScene(name) {
    Scenes = Require("./scenes");
    Crafty.scene(name, function() {
        var html = ['<div class="popup">',
                        '<div class="separator">¡HAS MUERTO!</div>',
                        '<p>¡Vuelve a intentarlo!</p>',
                        '<input class="button" type="button" value="¡Venganza!"/>',
                    '</div>'].join('\n');
        clean();
        $('.bottom').remove();
        $('#back').remove();
        $('body').append(html);
        $('.button').on("click", function() {
            $('.popup').remove();
            $('#cr-stage').show();
            Crafty.scene("Game");
        });
    });
    $('#cr-stage').fadeOut(800, function() {
        Crafty.scene("Death");
    });
}


function explanationScene(name, callbackScene) {
    var html = ['<div id="exp">',
                '<h1>Fuiste designado a la lejana luna Europa en una expedición bélica...<br/>',
                'Algo salió mal...<br/>Miras a tu alrededor y sólo hay extrañas criaturas y ni rastro de tus compañeros...<br/>',
                'Es hora de luchar por sobrevivir.<br/>¡Vamos!</h1>',
                '<img src="/assets/img/controls.png"/>',
                '<p>Los enemigos pueden descubrirte. ¡Escóndete para atacar tranquilamente!</p>',
                '<p>Si te descubren, ¡empezará una cuenta atrás que podría destruirte!</p>',
                '<p>Sólo podrás atacar cuando estés lo suficientemente cerca, así que ten cuidado.</p>',
                '<p>Haz caso a tu radar. Si está en amarillo, será mejor que te escondas. Si está en verde estarás a salvo.</p>',
                '<input class="button" type="button" value="¡Empezar!"/></div>',
                ].join('\n');
    Crafty.scene(name, function() {
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
            $('#cr-stage').show();
            clean();
            Crafty.scene(callbackScene);
        });
    });
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

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {

    loadGame: function(student, level, mode) {
        loadLevel(level, function(data) {
            if (data.map) {
                saveGame(student, level, function(ok) {
                    setStudent(student);
                    setLevel(level);
                    updateSavegameCookie(level);
                    initCrafty();
                    if (level === 1) {
                        gameScene('Game', data, mode);
                        explanationScene('Explanation', 'Game');
                        loadingScene('Loading','Explanation');
                        Crafty.scene('Loading');
                    } else {
                        gameScene('Game', data, mode);
                        loadingScene('Loading','Game');
                        Crafty.scene('Loading');
                    }
                });
            } else {
                endScene("End");
                Crafty.scene("End");
            }
        });
    },

    nextLevel: function(mode) {
        var html = ['<div class="popup">',
                '<div class="separator">¡NIVEL SUPERADO!</div>',
                '<p>Pulsa Siguiente para ir al siguiente nivel</p>',
                '<input class="button" type="button" value="Siguiente"/>',
            '</div>'].join('\n');
        $("#cr-stage").append(html);
        $('input').on("click",function() {
            $('.popup').remove();
            clean();
            Scenes = Require("./scenes");
            Scenes.loadGame(getStudent(), getLevel()+1, mode);
        });
    },

    restartLevel: function() {
        deathScene("Death");
    }

};

});