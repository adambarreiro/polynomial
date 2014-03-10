// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/bonus.js
// Author: Adam Barreiro
// Description: Bonus component
// Updated: 01-03-2014
// -----------------------------------------------------------------------------

define (function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var QUESTIONS = [];
var ANSWERS = [];
var CURATION = 70;
var POWER = 5;
var CLOCKS = 1;

/**
 * Ajax call to retrieve the questions and answers.
 */
function getQuestions(callback) {
    $.ajax({
        url: '/getQuestionsFile',
        type: 'POST',
        dataType: 'html',
        success: function(data) {
            var all = data.split("#");
            var q = [], a = [];
            for (var i = 0; i<all.length-1; i++) {
                if (i % 2 === 0) {
                    q.push(all[i]);
                } else {
                    a.push(all[i]);
                }
            }
            callback(q,a);
        }
    });
}

/**
 * Draws a popup explaining that the question was not answered correctly
 */
function mistakePopup(correctAnswer) {
    var html = ['<div class="popup">',
                    '<div class="separator">Perdiste el tesoro...</div>',
                    '<p>La afirmación era '+correctAnswer+'...</p>',
                    '<input class="button" type="button" name="true" value="Maldición"/>',
                '</div>'].join('\n');
    $("#cr-stage").append(html);
    $('input').on("click",function() {
        Crafty('Character').startAll();
        $('.popup').remove();
    });
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Creates the component.
     */
    createComponent: function() {
        Crafty.c('Bonus', {
            _power: 0, // Power up bonus
            _extraTime: 0, // Extra time bonus
            /**
             * Obtains an item randomly
             */
            item: function() {
                var bonus;
                var icon;
                var description;
                var p = Math.random();
                if (p < 0.70) {
                    bonus = "SALUD";
                    icon = "health";
                    description = "¡Notas como tu vida se restablece!";
                } else if (p > 0.70 && p < 0.8) {
                    bonus = "POTENCIA";
                    icon = "power";
                    description = "¡Puedes derrotar a tus enemigos más fácilmente!";
                } else if (p > 0.8 && p < 0.9) {
                    bonus = "ESCUDO";
                    icon = "shield";
                    description = "¡Puedes soportar más daño!";
                } else {
                    bonus = "TIEMPO EXTRA";
                    icon = "clock";
                    description = "¡Tienes más tiempo para realizar operaciones!";
                }
                $('.popup').remove();
                var html = ['<div class="popup">',
                                    '<div class="separator">¡TESORO OBTENIDO!</div>',
                                    '<p>Has conseguido <strong>' + bonus +'</strong></p>',
                                    '<p>' + description + '</p>',
                                    '<input class="button" type="button" name="true" value="Continuar"/>',
                                '</div>'].join('\n');
                $("#cr-stage").append(html);
                $('input').on("click",function() {
                    $('.popup').remove();
                    if (bonus !== "SALUD") {
                        if ($("#" + icon).length === 0) {
                            $('.inventory').append('<div class="element" id="'+icon+'"></div>');
                            $('#' +icon).css({"background" : "url('/assets/img/game/items/" + icon +".png') no-repeat"});
                        }
                    }
                    switch(icon) {
                        case "health":
                            Crafty.audio.play("health");
                            Crafty("Character")._health=Crafty("Character")._health + Math.floor(Math.random()*(100-CURATION+1)+CURATION);
                            if (Crafty("Character")._health > 100) Crafty("Character")._health = 100;
                            $('#lifebar').css({"width": (Crafty("Character")._health*3) + "px"});
                            break;
                        case "shield":
                            Crafty.audio.play("shield");
                            Crafty("Character")._shield=100;
                            $('#lifebar').css({"width": "300px", "background" : "rgb(50,50,200)"});
                            $('#vidatext').html("Escudo: ");
                            break;
                        case "power":
                            Crafty.audio.play("power");
                            Crafty("Character")._power=Crafty("Character")._power+POWER;
                            break;
                        case "clock":
                            Crafty.audio.play("clock");
                            Crafty("Character")._extraTime = Crafty("Character")._extraTime+CLOCKS;
                            break;
                    }
                    Crafty("Character").startAll();
                });
            },
            /**
             * Draws a popup with a random question from the questions text file.
             */
            treasure: function() {
                var p = Crafty.map.search({_x: this.x+15, _y: this.y, _w: 1, _h: 32}, true);
                if (p.length > 1) {
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
                            Crafty.audio.play("chest");
                            chest._opened = true;
                            if (QUESTIONS.length === 0 || ANSWERS.length === 0) return;
                            var index = (Math.floor(Math.random()*QUESTIONS.length));
                            var html = ['<div class="popup">',
                                    '<div class="separator">¡TESORO ENCONTRADO!</div>',
                                    '<p>' + QUESTIONS[index] +'</p>',
                                    '<input class="button" type="button" name="true" value="Verdadero"/>',
                                    '<input class="button" type="button" name="false" value="Falso"/>',
                                '</div>'].join('\n');
                            $("#cr-stage").append(html);
                            var fallo = false;
                            $('input[name=true]').on("click",function() {
                                if (ANSWERS[index] == "V") {
                                    Crafty("Character").item();
                                } else {
                                    mistakePopup("falsa");
                                }
                            });
                            $('input[name=false]').on("click",function() {
                                if (ANSWERS[index] == "F") {
                                    Crafty("Character").item();
                                } else {
                                    mistakePopup("verdadera");
                                }
                            });
                        }
                    }
                }
            },
            /**
             * Removes a bonus icon from the bonus bar
             * @param bonus - The bonus type
             */
            removeBonus: function(bonus) {
                $("#"+bonus).remove();
            },
            /**
             * Inits the component
             */
            init: function() {
                getQuestions(function(q,a) {
                    QUESTIONS = q;
                    ANSWERS = a;
                });
                this.bind("KeyDown", function () {
                    if (this.isDown("S")) {
                        this.treasure();
                    }
                });
            }
        });
    }
};

});