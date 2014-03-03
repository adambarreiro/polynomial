// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["./constants","./components", "./scenes", "require", "./menu"], function(Constants, Components, Scenes, Require, Menu) {

var CHARACTER;
var QUESTIONS;
var ANSWERS;

function setCharacter(entity) {
    CHARACTER = entity;
}

function getCharacter() {
    return CHARACTER;
}

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


// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {

    getGamePanel: function() {
        var Menu = Require("menu");
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
       /* $('#two').bind('click',function() {
            $('.container').empty();
            $('.container').append(getTwoPlayerPanel());
            $('#wait').bind('click', function() {
                $('body').empty();
            });
            $('#connect').bind('click', function() {
                $('body').empty();
            });
            Menu.menuHandler();
        });*/
    },

    getQuestions: function() {
        return QUESTIONS;
    },
    setQuestions: function(questions) {
        QUESTIONS = questions;
    },
    getAnswers: function() {
        return ANSWERS;
    },
    setAnswers: function(answers) {
        ANSWERS = answers;
    }

};

});