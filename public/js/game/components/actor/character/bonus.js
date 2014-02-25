// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/bonus.js
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
        Crafty.c('Char', {
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
            item: function() {

                var bonus;
                var icon;
                var description;
                var p = Math.random();
                if (p < 0.70) {
                    bonus = "SALUD";
                    icon = "health.png";
                    description = "¡Notas como tu vida se restablece!";
                } else if (p > 0.70 && p < 0.8) {
                    bonus = "POTENCIA";
                    icon = "power.png";
                    description = "¡Puedes derrotar a tus enemigos más fácilmente!";
                } else if (p > 0.8 && p < 0.9) {
                    bonus = "ESCUDO";
                    icon = "shield.png";
                    description = "¡Puedes soportar más daño!";
                } else {
                    bonus = "TIEMPO EXTRA";
                    icon = "time.png";
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
                    Crafty('Char').startAll();
                    Crafty('Enemy').each(function() {
                        this.startAll();
                    });
                    $('.popup').remove();
                    if (bonus !== "SALUD") {
                        $('.inventory').append('<div class="element"></div>');
                        var elements = $('.element');
                        $(elements[elements.length-1]).css({"background" : "url('/assets/img/items/" + icon +"') no-repeat"});
                    }
                    switch(bonus) {
                        case "SALUD":
                            var salud = Crafty("Char")._health;
                            salud=salud + Math.floor(Math.random()*(100-70+1)+70);
                            if (salud > 100) salud = 100;
                            Crafty("Char")._health = salud;
                            $('#lifebar').css({"width": (salud*3) + "px"});
                            break;
                        case "ESCUDO":
                            Crafty("Char")._shield=100;
                            $('#lifebar').css({"width": "300px", "background" : "rgb(50,50,200)"});
                            $('#vidatext').html("Escudo: ");
                            break;
                        case "POTENCIA": Crafty("Char")._operations=3; break;
                        case "TIEMPO EXTRA": Crafty("Char")._timeout=25.99; break;
                    }
                });
            }
        });
    }
};

});