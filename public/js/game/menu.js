// -----------------------------------------------------------------------------
// Name: /public/js/game/menu.js
// Author: Adam Barreiro
// Description: Draws the game menu with single and multi player options.
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * menu.js
 * @dependency /public/js/game/scenes.js
 * @dependency /public/js/game/network/connector.js
 * @dependency /public/js/game/network/creator.js
 */
define (["./scenes", "./network/connector", "./network/creator", "require", "./menu"], function(Scenes, Connector, Creator, Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var START_LEVEL = 1; // Loaded level
var FIRST_LEVEL = 10; // Start of the game

function  getSavegame(callback) {
    var Menu = Require("./menu");
    student = Menu.readStudentCookie();
    $.ajax({
        url: '/loadGame',
        type: 'POST',
        data: {email: student},
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
}

function csrf() {
    var pri = document.cookie.indexOf("token=")+"token=".length;
    var fin = document.cookie.indexOf(";", pri);
    if (fin < 0) {
        fin = document.cookie.length;
    }
    return '<input type="hidden" value="' + document.cookie.substring(pri,fin) + '" name="_csrf" />';
}

/**
 * Returns true if the length of a text exceeds a limit given.
 * @param text - The text to check.
 * @param limitUp - Limit that must not be exceeded.
 * @param limitDown - Limit that must BE exceeded. If <=0 ignores it.
 * @return Boolean - True if the length is allright.
 */
function lengthCheck(text, limitUp, limitDown) {
    var r = text.length <= limitUp;
    if (limitDown > 0)
        r = r && (text.length >= limitDown);
    return r;
}

/**
 * Checks if the text has valid characters for a generic text depending on
 * the parameters given: Only letters, or only letters and numbers, etc.
 * @param text - The text to check.
 * @param allowEmpty - Allows the text to be empty.
 * @param allowNumbers - Allows the text to have numbers.
 * @return Boolean - True if text is correct.
 */
function checkText(text, allowEmpty, allowNumbers) {
    var regex = /^(\ *[A-Za-zÁáÉéÍíÓóÚúÜüºª]+\ *)+$/;
    if (allowNumbers) regex = /^(\ *[A-Za-z0-9ÁáÉéÍíÓóÚúÜüºª]+\ *)+$/;
    if (!lengthCheck(text, 20, 1))
        return false;
    else
        if (!allowEmpty)
            return regex.test(text);
        else
            return (text === "") || regex.test(text);
}

function getOnePlayerPanel() {
    var cont = '';
    var Menu = Require("menu");
    if (START_LEVEL > 1) {
        cont = '<div class="buttonext" id="continue">Continuar</div>';
    }
    return ['<div class="menu">',
                '<div class="separator">En solitario</div>',
                '<div class="buttonext" id="new">Nuevo juego</div>',
                cont,
            '</div>',
            '<div class="extra">',
                '<div id="edbutton">Atr&aacute;s</div>',
            '</div>'].join('\n');
}

function getTwoPlayerPanel() {
    return ['<div class="menu">',
                '<div class="separator">Con un amigo</div>',
                '<div class="buttonext" id="create">Crear partida</div>',
                '<div class="buttonext" id="connect">Entrar en una partida</div>',
            '</div>',
            '<div class="extra">',
                '<div id="edbutton">Atr&aacute;s</div>',
            '</div>'].join('\n');
}

function twoPlayerMenuHandler() {
    var Menu = Require("menu");
    $('#create').bind('click', function() {
        Menu.createPanel();
    });
    // Connect to a player
    $('#connect').bind('click', function() {
        Menu.connectPanel();
    });
    $('#edbutton').bind('click',function() {
    $('.container').empty();
    $('.container').append(Menu.getGamePanel());
        Menu.menuHandler();
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {

    getGamePanel: function() {
        return ['<div class="menu">',
                    '<div class="separator">Modo de juego</div>',
                    '<div class="buttonext" id="one">Un jugador</div>',
                    '<div class="buttonext" id="two">Dos jugadores</div>',
                    '</div>',
                '<div class="extra">',
                    '<form method="GET" action="signout">',
                        csrf(),
                        '<input id="lobutton" type="submit" value="Salir"/>',
                    '</form>',
                '</div>'].join('\n');
    },
    menuHandler: function() {
        var Menu = Require("menu");
        getSavegame(function(data) {
            if (data) START_LEVEL = data.level;
            $('#one').bind('click',function() {
                $('.container').empty();
                $('.container').append(getOnePlayerPanel());
                $('#new').bind('click', function() {
                    var save = START_LEVEL;
                    if (save > 1) {
                        $("#edbutton").hide();
                        $(".menu").hide();
                        $('.container').before(['<div class="menu" id="sure">',
                                                '<div class="separator">¿Empezar de nuevo?</div>',
                                                '<p>Vas por el nivel ' + save + ', seguro que quieres empezar desde el nivel 1?</p>',
                                                '<div class="buttonext" id="yes">Sí</div>',
                                                '<div class="buttonext" id="no">No</div>',
                                            '</div>'].join('\n'));
                        $('#yes').bind('click', function() {
                            Menu.startGame(Menu.readStudentCookie(),FIRST_LEVEL);
                        });
                        $('#no').bind('click', function() {
                            $("#sure").remove();
                            $('.menu').show();
                            $("#edbutton").show();
                        });
                    } else {
                        Menu.startGame(Menu.readStudentCookie(),FIRST_LEVEL);
                    }
                });
                $('#continue').bind('click', function() {
                    Menu.startGame(Menu.readStudentCookie(), START_LEVEL);
                });
                $('#edbutton').bind('click',function() {
                    $('.container').empty();
                    $('.container').append(Menu.getGamePanel());
                    Menu.menuHandler();
                });
            });
            $('#two').bind('click',function() {
                $('.container').empty();
                $('.container').append(getTwoPlayerPanel());
                twoPlayerMenuHandler();
            });
        });
    },
    createPanel: function() {
        $('.container').empty();
        $('.container').append(['<div class="menu">',
                    '<div class="separator">Crear partida</div>',
                    '<input class="field" type="text" name="game" placeholder="Nombre de la partida"/>',
                    '<div class="buttonext" id="create">Crear</div>',
                '</div>',
                '<div class="extra">',
                    '<div id="edbutton">Atr&aacute;s</div>',
                '</div>'].join('\n'));
        $('#create').bind('click', function() {
            var game = $("input[name='game']").val();
            if (checkText(game, false, true)) {
                $("body").unbind("keyup");
                Creator.startCreator(game);
            }
        });
        $("body").bind("keyup", function(e) {
            if ((e.keyCode || e.which) == 13) {
                var game = $("input[name='game']").val();
                if (checkText(game, false, true)) {
                    $("body").unbind("keyup");
                    Creator.startCreator(game);
                }
            }
        });
        $('#edbutton').bind('click',function() {
            $("body").unbind("keyup");
           $('.container').empty();
           $('.container').append(getTwoPlayerPanel());
           twoPlayerMenuHandler();
        });
    },
    connectPanel: function() {
        $('.container').empty();
        $('.container').append(['<div class="menu">',
                    '<div class="separator">Conectar</div>',
                    '<input class="field" type="text" name="game" placeholder="Nombre de la partida"/>',
                    '<div class="buttonext" id="connect">Conectar</div>',
                '</div>',
                '<div class="extra">',
                    '<div id="edbutton">Atr&aacute;s</div>',
                '</div>'].join('\n'));
        $('#connect').bind('click', function() {
            var game = $("input[name='game']").val();
            if (checkText(game, false, true)) {
                $("body").unbind("keyup");
                Connector.startConnector(game);
            }
        });
        $("body").bind("keyup", function(e) {
            if ((e.keyCode || e.which) == 13) {
                var game = $("input[name='game']").val();
                if (checkText(game, false, true)) {
                    $("body").unbind("keyup");
                    Connector.startConnector(game);
                }
            }
        });
        $('#edbutton').bind('click',function() {
        $("body").unbind("keyup");
           $('.container').empty();
           $('.container').append(getTwoPlayerPanel());
           twoPlayerMenuHandler();
        });
    },
    waitingMenu: function(game) {
        var html = ['<div class="menu">',
                    '<div class="separator">Esperando...</div>',
                    '<p>Esperando a que tu amigo se conecte a "'+ game + '"...</p>',
                '</div>',
                '<div class="extra">',
                    '<div id="edbutton">Atr&aacute;s</div>',
                '</div>'].join('\n');
        $('.container').empty();
        $('.container').append(html);
        $('#edbutton').bind('click',function() {
            $('.container').empty();
            $('.container').append(getTwoPlayerPanel());
            Creator.closeCreator(game);
            twoPlayerMenuHandler();
        });

    },
    connectionMenu: function(game) {
        var html = ['<div class="menu">',
                    '<div class="separator">Conectando...</div>',
                    '<p>Conectando a la partida "'+ game+'"...</p>',
                '</div>',
                '<div class="extra">',
                    '<div id="edbutton">Atr&aacute;s</div>',
                '</div>'].join('\n');
        $('.container').empty();
        $('.container').append(html);
        $('#edbutton').bind('click',function() {
            $('.container').empty();
            $('.container').append(getTwoPlayerPanel());
            Connector.closeConnector(game);
            twoPlayerMenuHandler();
        });
    },
    startGame: function(student, level, multi) {
        $('body').empty();
        if (multi === undefined) multi = {multi: "single"}; // No multiplayer trick.
        Scenes.newGame(student, level, multi.multi);
    },
    readStudentCookie: function() {
        var pri = document.cookie.indexOf("student=")+"student=".length;
        var fin = document.cookie.indexOf(";", pri);
        if (fin < 0) {
            fin = document.cookie.length;
        }
        return document.cookie.substring(pri,fin);
    },
    getLevel: function() {
        return START_LEVEL;
    }
};

});