// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/damage.js
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
    createComponent: function(editing) {
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
            init: function(item) {
                var shield = Crafty("Char")._shield;
                var health = Crafty("Char")._health;
                switch(item) {
                    case "lava":
                        if (shield > 0) {
                            shield=shield-2;
                        } else {
                            health--;
                        }
                        break;
                    case "enemy":
                        if (shield > 0) {
                            shield = shield - Math.floor(Math.random()*(55-30+1)+30);
                        } else {
                            health = health - Math.floor(Math.random()*(15-10+1)+10);
                        }
                        break;
                }
                if (shield <= 0) {
                    shield = 0;
                    $('#lifebar').css({"width": "300px", "background" : "rgb(50,200,50)"});
                    $('#vidatext').html("Vida:");
                }
                if (shield > 0) {
                    $('#lifebar').css({"width": (shield*3) + "px"});
                } else {
                    if (health > 0) {
                        $('#lifebar').css({"width": (health*3) + "px"});
                    } else {
                        if (item === "lava") clearInterval(Crafty("Char")._cronoLava);
                        if (item === "enemy") {
                            Crafty("Char").stopAll();
                            Crafty('obj').each(function() { this.destroy(); });
                            clearInterval(Crafty("Char")._battleTimer);
                            $(".battle").remove();
                            $("body").unbind("keydown");
                        }
                        Scenes.restartLevel();
                    }
                }
                Crafty("Char")._shield = shield;
                Crafty("Char")._health = health;

            }
        });
    }
};

});