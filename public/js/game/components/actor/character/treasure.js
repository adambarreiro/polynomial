// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

define (function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the engine.
     */
    init: function(editing) {
        Crafty.c('Treasure', {
            _old_x: undefined,
            _range: undefined,
            _health: 100,
            _timeout: 24.99,
            _operations: 5,
            _shield: 0,
            _invisible: false,
            _detected: false,
            _canAttack: false,
            _enemy: undefined,
            _battleTimer: undefined,
            _polinomios: [],
            
            init: function() {
                var p = Crafty.map.search({_x: this.x+15, _y: this.y, _w: 1, _h: 32}, true);
                if (p.length > 1) {
                    var Menu = Require("menu");
                    var chest;
                    for (var i=0; i<p.length; i++) {
                        if (p[i].has("Chest")) {
                            chest = p[i];
                            break;
                        }
                    }
                    if (chest !== undefined) {
                        if (!chest._opened) {
                            this.stopAll();
                            chest._opened = true;
                            var questions = Menu.getQuestions();
                            var answers = Menu.getAnswers();
                            var index = (Math.floor(Math.random()*(questions.length-1))+1);
                            var html = ['<div class="popup">',
                                    '<div class="separator">¡TESORO ENCONTRADO!</div>',
                                    '<p>' + questions[index] +'</p>',
                                    '<input class="button" type="button" name="true" value="Verdadero"/>',
                                    '<input class="button" type="button" name="false" value="Falso"/>',
                                '</div>'].join('\n');
                            $("#cr-stage").append(html);
                            $('input[name=true]').on("click",function() {
                                if (answers[index] == "V") {
                                    Crafty("Char").item();
                                } else {
                                     var html = ['<div class="popup">',
                                            '<div class="separator">Perdiste el tesoro...</div>',
                                            '<p>La afirmación era falsa...</p>',
                                            '<input class="button" type="button" name="true" value="Maldición"/>',
                                        '</div>'].join('\n');
                                    $("#cr-stage").append(html);
                                    $('input').on("click",function() {
                                        Crafty('Char').startAll();
                                        Crafty('Enemy').each(function() {
                                            this.startAll();
                                        });
                                        $('.popup').remove();
                                    });
                                }
                            });
                            $('input[name=false]').on("click",function() {
                                if (answers[index] == "F") {
                                    Crafty("Char").item();
                                } else {
                                    var html = ['<div class="popup">',
                                            '<div class="separator">Perdiste el tesoro...</div>',
                                            '<p>La afirmación era verdadera...</p>',
                                            '<input class="button" type="button" name="true" value="Maldición"/>',
                                        '</div>'].join('\n');
                                    $("#cr-stage").append(html);
                                    $('input').on("click",function() {
                                        Crafty('Char').startAll();
                                        Crafty('Enemy').each(function() {
                                            this.startAll();
                                        });
                                        $('.popup').remove();
                                    });
                                }
                            });
                        }
                    }
                }
            }
        });
    }
};

});