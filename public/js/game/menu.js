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
                '<div class="separator">Con un amigo</div>',
                '<div class="buttonext" id="create">Crear partida</div>',
                '<div class="buttonext" id="connect">Entrar en una partida</div>',
            '</div>',
            '<div class="extra">',
                '<div id="edbutton">Atr&aacute;s</div>',
            '</div>'].join('\n');
}

function createPanel() {
   return ['<div class="menu">',
                '<div class="separator">Crear partida</div>',
                '<input class="field" type="text" name="ip" placeholder="IP de tu PC"/>',
                '<div class="buttonext" id="create">Crear</div>',
            '</div>',
            '<div class="extra">',
                '<div id="edbutton">Atr&aacute;s</div>',
            '</div>'].join('\n');
}

function connectPanel() {
   return ['<div class="menu">',
                '<div class="separator">Conectar</div>',
                '<input class="field" type="text" name="ip" placeholder="IP del PC de tu amigo"/>',
                '<div class="buttonext" id="connect">Conectar</div>',
            '</div>',
            '<div class="extra">',
                '<div id="edbutton">Atr&aacute;s</div>',
            '</div>'].join('\n');
}

function twoPlayerMenuHandler() {
    var Menu = Require("menu");
    // Wait for player
    // Connect to a player
    $('#create').bind('click', function() {
        $('.container').empty();
        $('.container').append(createPanel());
        $('#create').bind('click', function() {
            var ip = $("input[name='ip']").val();
            Network.createCreator('http://localhost');
        });
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
        $('#connect').bind('click', function() {
            var ip = $("input[name='ip']").val();
            Network.createConnector('http://localhost');
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
                Menu.startGame(Menu.readStudentCookie(), 1);
            });
            $('#continue').bind('click', function() {
                Menu.startGame(Menu.readStudentCookie(), Menu.readSavegameCookie());
            });
            Menu.menuHandler();
        });
       $('#two').bind('click',function() {
            $('.container').empty();
            $('.container').append(getTwoPlayerPanel());
            twoPlayerMenuHandler();
        });
    },
    waitingMenu: function() {
       var html = ['<div class="menu">',
                    '<div class="separator">Esperando...</div>',
                    '<p>Esperando a que tu amigo se conecte...</p>',
                '</div>',
                '<div class="extra">',
                    '<div id="edbutton">Atr&aacute;s</div>',
                '</div>'].join('\n');
        $('.container').empty();
        $('.container').append(html);
        $('#edbutton').bind('click',function() {
            $('.container').empty();
            $('.container').append(getTwoPlayerPanel());
            twoPlayerMenuHandler();
        });

    },
    connectionMenu: function() {
       var html = ['<div class="menu">',
                    '<div class="separator">Conectando...</div>',
                    '<p>Conectando al PC de tu amigo...</p>',
                '</div>',
                '<div class="extra">',
                    '<div id="edbutton">Atr&aacute;s</div>',
                '</div>'].join('\n');
        $('.container').empty();
        $('.container').append(html);
        $('#edbutton').bind('click',function() {
            $('.container').empty();
            $('.container').append(getTwoPlayerPanel());
            twoPlayerMenuHandler();
        });
    },
    startGame: function(student, level) {
        $('body').empty();
        Scenes.loadGame(student, level);
    },
    readSavegameCookie: function() {
        var pri = document.cookie.indexOf("savegame=")+"savegame=".length;
        var fin = document.cookie.indexOf(";", pri);
        if (fin < 0) {
            fin = document.cookie.length;
        }
        return parseInt(document.cookie.substring(pri,fin),10);
    },
    readStudentCookie: function() {
        var pri = document.cookie.indexOf("student=")+"student=".length;
        var fin = document.cookie.indexOf(";", pri);
        if (fin < 0) {
            fin = document.cookie.length;
        }
        return document.cookie.substring(pri,fin);
    }
};

});