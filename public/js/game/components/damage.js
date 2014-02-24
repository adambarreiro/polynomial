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
            damage: function(item) {
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

            },
            detection: function() {
                if (this.hit("Hide")) {
                    this._invisible = true;
                } else {
                    this._invisible = false;
                }
                var obst_izq, obst_der;
                this._range = Crafty.map.search({_x: this.x-319, _y: this.y, _w: 638, _h: 30}, true);
                for (var i=0; i<this._range.length; i++) {
                    if (this._enemy === undefined && this._range[i].has("Enemy")) {
                        this._enemy = this._range[i];
                    } else if (this._range[i].has("Terrain")) {
                        if (obst_izq !== undefined) {
                            if ((this.x > this._range[i].x) && (this.x - obst_izq.x > this.x - this._range[i].x)) {
                                obst_izq = this._range[i];
                            }
                        } else {
                            if (this.x > this._range[i].x) {
                                obst_izq = this._range[i];
                            }
                        }
                        if (obst_der !== undefined) {
                            if ((this.x < this._range[i].x) && (obst_der.x - this.x > this._range[i].x - this.x)) {
                                obst_der = this._range[i];
                            }
                        } else {
                            if (this.x < this._range[i].x) {
                                obst_der = this._range[i];
                            }
                        }
                    }
                }
                if (this._enemy !== undefined) {
                    var cubierto = false;
                    var d;
                    if (this._enemy._orientation === "left") {
                        if (this._enemy.x >= this.x) {
                            if (obst_der !== undefined) {
                                if (this._enemy.x > obst_der.x && this.x < obst_der.x) {
                                    cubierto = true;
                                    this._canAttack = false;
                                }
                            }
                            if (!cubierto) {
                                d = Math.abs(this.x - this._enemy.x);
                                if (d < 128.0 && !this._invisible) {
                                    this._detected = true;
                                } else {
                                    this._detected = false;
                                    if (d < 128.0) this._canAttack = true;
                                    else this._canAttack = false;
                                }
                            }
                        } else {
                            d = Math.abs(this.x - this._enemy.x);
                            if (d < 128.0) this._canAttack = true;
                            else this._canAttack = false;
                            this._detected = false;
                        }
                    }
                    else if (this._enemy._orientation === "right") {
                        if (this._enemy.x <= this.x) {
                            if (obst_izq !== undefined) {
                                if (obst_izq.x > this._enemy.x && this.x > obst_izq.x) {
                                    cubierto = true;
                                    this._canAttack = false;
                                }
                            }
                            if (!cubierto) {
                                d = Math.abs(this.x - this._enemy.x);
                                if (d < 128.0 && !this._invisible) {
                                    this._detected = true;
                                } else {
                                    this._detected = false;
                                    if (d < 128.0) this._canAttack = true;
                                    else this._canAttack = false;
                                }
                            }
                        } else {
                            d = Math.abs(this.x - this._enemy.x);
                            if (d < 128.0) this._canAttack = true;
                            else this._canAttack = false;
                            this._detected = false;
                        }
                    }

                    if (this._invisible) {
                        if (this._canAttack) {
                            $('#timeout').css({"color":"cyan",  "border-color" : "cyan"});
                            $('#timeout').html("¡ESTÁS ESCONDIDO Y PUEDES ATACAR!");
                        } else {
                            $('#timeout').css({"color":"#33FF33", "border-color" : "#33FF33"});
                            $('#timeout').html("¡ESTÁS ESCONDIDO! ESPERA PARA ATACAR...");
                        }
                    } else {
                        if (cubierto) {
                            $('#timeout').css({"color":"white",  "border-color" : "white"});
                            $('#timeout').html("SIN PELIGRO");
                        } else {
                            if (this._detected) {
                                $('#timeout').css({"color":"red",  "border-color" : "red"});
                                $('#timeout').html("ALERTA MÁXIMA, ¡TE HAN PILLADO!");
                            } else {
                                $('#timeout').css({"color":"yellow", "border-color" : "yellow"});
                                if (this._canAttack) {
                                    $('#timeout').html("¡¡ENEMIGO MUY CERCA, ATACA O ESCÓNDETE!!");
                                } else {
                                    $('#timeout').html("¡CUIDADO, ENEMIGO A LA VISTA!");
                                }
                            }
                        }
                    }
                } else {
                    if (!this._invisible) {
                        $('#timeout').css({"color":"white", "border-color" : "white"});
                        $('#timeout').html("SIN PELIGRO");
                    } else {
                        $('#timeout').css({"color":"#33FF33", "border-color" : "#33FF33"});
                        $('#timeout').html("¡ESTÁS ESCONDIDO! ESPERA PARA ATACAR...");
                    }
                    
                }
                if (this._detected) {
                    this._detected = false;
                    this.battle(true);
                }
            },
            battle: function(timed) {
                Crafty('Char').stopAll();
                $("#cr-stage").append(polynomialBattle());
                var time = this._timeout;
                $($(".lifebox").children()[2]).show();
                $($(".lifebox").children()[3]).show();
                this._battleTimer = setInterval( function() {
                    time-=0.01;
                    if (time <= 0.0) {
                        Crafty("Char").damage("enemy");
                        time = Crafty("Char")._timeout;
                    }
                    $("#time").text(time.toFixed(2));
                }, 10);
                polynomialKeyboard();
            },
            verticalScroll: function() {
                if (this.y > Constants.getViewportSize('px').height / 2)
                    Crafty.viewport.scroll('_y', -(this.y + (this.h / 2) - (Constants.getViewportSize('px').height / 2)));
            },
            horizontalScroll: function(from) {
                var size = Constants.getViewportSize('px');
                    if (this._old_x !== this.x && (Math.abs(this.x - from.x) > 1)) {
                        this._old_x = this.x;
                        if (this.x > size.width/2) {
                            Crafty.viewport.x -= this.x - from.x;
                        }
                    }
                    if(this.hit('Terrain')){
                        this.attr({x: from.x, y:from.y});
                    }
            },
            bounds: function(from) {
                if (this.x <= 0 || this.x >= Constants.getLevelSize('px').width) {
                    this.x = from.x;
                }
            },
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
            },
            treasure: function() {
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
            },
            stopAll: function() {
                this.unbind("EnterFrame");
                this.unbind("Moved");
                this.unbind("KeyDown");
                Crafty('Enemy').each(function() {
                    this.removeComponent("Patrol");
                    this.unbind("EnterFrame");
                });
            },
            startAll: function() {
                this.gravity("Terrain").gravityConst(0.3);
                this.multiway(3, {
                    RIGHT_ARROW: 0,
                    LEFT_ARROW: 180
                });
                this.bind("EnterFrame", function () {
                    this.detection();
                    this.verticalScroll();
                });
                this.bind('Moved', function(from) {
                    this.bounds(from);
                    this.lava();
                    this.horizontalScroll(from);
                });
                this.bind("KeyDown", function () {
                    if (this.isDown("A")) {
                        if (this._canAttack) {
                            if (!this._invisible) {
                                this.battle(true);
                            } else {
                                this.battle(false);
                            }
                        }
                    }
                    else if (this.isDown("S")) {
                        this.treasure();
                    }
                });
            },
            init: function() {
                Body.init();
                this.requires('2D, Canvas, SpriteAnimation, Collision, Grid, Gravity, Keyboard, Fourway, spr_char, Body');
                this.z=2;
                if (!editing) {
                    this.startAll();
                }
            }
        });
    }
};

});