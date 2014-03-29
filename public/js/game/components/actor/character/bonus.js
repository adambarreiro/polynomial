// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/bonus.js
// Author: Adam Barreiro
// Description: Bonus and item generator, questions file handler.
// -----------------------------------------------------------------------------

/**
 * bonus.js
 * @dependency /public/js/game/audio.js
 */
define (["../../../audio"], function(Audio) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var QUESTIONS = [];
var ANSWERS = [];
var CURATION = 70;
var POWER = 3;
var CLOCKS = 1;

function parseQuestion(question) {
    var parsed = "";
    var parsedArray = question.split("^");
    if (parsedArray.length > 1) {
        // The first part only has a <sup>, never starts with </sup>
        parsed += parsedArray[0].concat("<sup>");
        // The rest part
        for (i=1; i<parsedArray.length; i++) {
            // Replace "^" with "<sup>, except if it's the last part"
            if (i < parsedArray.length-1) parsedArray[i] = parsedArray[i].concat("<sup>");
            // Search where the exponent ends
            var firstNoNumber = parsedArray[i].search(/[^0-9]/);
            // Rebuild the string
            parsed += parsedArray[i].substring(0,firstNoNumber) + "</sup>" +
            parsedArray[i].substring(firstNoNumber,parsedArray[i].length);
        }
    } else {
        parsed = question;
    }
    return parsed;
}

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
                    q.push(parseQuestion(all[i]));
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
            /**
             * Obtains an item randomly
             */
            item: function() {
                var bonus;
                var icon;
                var description;
                var p = Math.random();
                if (p < 0.50) {
                    bonus = "SALUD";
                    icon = "health";
                    description = "¡Notas como tu vida se restablece!";
                } else if (p >= 0.50 && p < 0.666) {
                    bonus = "POTENCIA";
                    icon = "power";
                    description = "¡Tus próximos " + (+this._power + POWER) +" ataques serán críticos!";
                } else if (p >= 0.666 && p < 0.835) {
                    bonus = "ESCUDO";
                    icon = "shield";
                    description = "¡Puedes soportar más daño!";
                } else{
                    bonus = "TIEMPO EXTRA";
                    icon = "clock";
                    description = "¡En el próximo combate tendrás más tiempo!";
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
                            Audio.playHealth();
                            Crafty("Character")._health=Crafty("Character")._health + Math.floor(Math.random()*(100-CURATION+1)+CURATION);
                            if (Crafty("Character")._health > 100) Crafty("Character")._health = 100;
                            $('#lifebar').css({"width": (Crafty("Character")._health*3) + "px"});
                            break;
                        case "shield":
                            Audio.playShield();
                            Crafty("Character")._shield=100;
                            $('#lifebar').css({"width": "300px", "background" : "rgb(50,50,200)"});
                            $('#vidatext').html("Escudo: ");
                            break;
                        case "power":
                            Audio.playPower();
                            Crafty("Character")._power=Crafty("Character")._power+POWER;
                            break;
                        case "clock":
                            Audio.playClock();
                            Crafty("Character")._clocks = Crafty("Character")._clocks+CLOCKS;
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
                            Audio.playChest();
                            chest._opened = true;
                            chest.sprite(1,0);
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
                if (QUESTIONS.length === 0 && ANSWERS.length === 0) {
                    getQuestions(function(q,a) {
                        QUESTIONS = q;
                        ANSWERS = a;
                    });
                }
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