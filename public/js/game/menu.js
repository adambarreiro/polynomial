// -----------------------------------------------------------------------------
// Name: /public/js/game/menu.js
// Author: Adam Barreiro
// Description: Draws the game menu with single and multi player options.
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * menu.js
 * @dependency /public/js/game/scenes.js
 */
define (["./scenes", "./network", "require", "./menu"], function(Scenes, Network, Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
function csrf() {
    var pri = document.cookie.indexOf("token=")+"token=".length;
    var fin = document.cookie.indexOf(";", pri);
    if (fin < 0) {
        fin = document.cookie.length;
    }
    return '<input type="hidden" value="' + document.cookie.substring(pri,fin) + '" name="_csrf" />';
}

function readSavegameCookie() {
    var pri = document.cookie.indexOf("savegame=")+"savegame=".length;
    var fin = document.cookie.indexOf(";", pri);
    if (fin < 0) {
        fin = document.cookie.length;
    }
    return parseInt(document.cookie.substring(pri,fin),10);
}

function readStudentCookie() {
    var pri = document.cookie.indexOf("student=")+"student=".length;
    var fin = document.cookie.indexOf(";", pri);
    if (fin < 0) {
        fin = document.cookie.length;
    }
    return document.cookie.substring(pri,fin);
}


function getOnePlayerPanel() {
    var cont = '';
    if (readSavegameCookie() > 1) {
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
                '<div class="separator">Cooperativo</div>',
                '<div class="buttonext" id="wait">Esperar partida</div>',
                '<div class="buttonext" id="connect">Conectar a jugador</div>',
            '</div>',
            '<div class="extra">',
                '<div id="edbutton">Atr&aacute;s</div>',
            '</div>'].join('\n');
}

function waitingPanel() {
   return ['<div class="menu">',
                '<div class="separator">Esperando...</div>',
                '<p>Esperando jugador...</p>',
            '</div>',
            '<div class="extra">',
                '<div id="edbutton">Atr&aacute;s</div>',
            '</div>'].join('\n');
}

function connectPanel() {
   return ['<div class="menu">',
                '<div class="separator">Conectar</div>',
                '<input class="field" type="text" name="ip" placeholder="Dirección IP"/>',
                '<div class="buttonext" id="net">Conectar</div>',
            '</div>',
            '<div class="extra">',
                '<div id="edbutton">Atr&aacute;s</div>',
            '</div>'].join('\n');
}

function twoPlayerMenuHandler() {
    var Menu = Require("menu");
    // Wait for player
    $('#wait').bind('click', function() {
        $('.container').empty();
        $('.container').append(waitingPanel());
        Network.createServer('http://localhost');
        $('#edbutton').bind('click',function() {
           $('.container').empty();
           $('.container').append(getTwoPlayerPanel());
           twoPlayerMenuHandler();
        });
    });
    // Connect to a player
    $('#connect').bind('click', function() {
        $('.container').empty();
        $('.container').append(connectPanel());
        $('#net').bind('click', function() {
            var ip = $("input[name='ip']").val();
            Network.createClient('http://localhost');
        });
        $('#edbutton').bind('click',function() {
           $('.container').empty();
           $('.container').append(getTwoPlayerPanel());
           twoPlayerMenuHandler();
        });
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
        $('#edbutton').bind('click',function() {
           $('.container').empty();
           $('.container').append(Menu.getGamePanel());
           Menu.menuHandler();
        });
        $('#one').bind('click',function() {
            $('.container').empty();
            $('.container').append(getOnePlayerPanel());
            $('#new').bind('click', function() {
                $('body').empty();
                Scenes.loadGame(readStudentCookie(), 1);
            });
            $('#continue').bind('click', function() {
                $('body').empty();
                Scenes.loadGame(readStudentCookie(), readSavegameCookie());
            });
            Menu.menuHandler();
        });
       $('#two').bind('click',function() {
            $('.container').empty();
            $('.container').append(getTwoPlayerPanel());
            twoPlayerMenuHandler();
        });
    }
};

});