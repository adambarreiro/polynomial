// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["../constants", "./patrol", "../scenes" ,"require", "../menu"], function(Constants, Patrol, Scenes, Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var drawLava = {
    maxParticles: 150,
    size: 18,
    sizeRandom: 4,
    speed: 1,
    speedRandom: 1.2,
    // Lifespan in frames
    lifeSpan: 29,
    lifeSpanRandom: 7,
    // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
    angle: 65,
    angleRandom: 34,
    startColour: [255, 131, 0, 1],
    startColourRandom: [48, 50, 45, 0],
    endColour: [245, 35, 0, 0],
    endColourRandom: [60, 60, 60, 0],
    // Only applies when fastMode is off, specifies how sharp the gradients are drawn
    sharpness: 20,
    sharpnessRandom: 10,
    // Random spread from origin
    spread: 10,
    // How many frames should this last
    duration: -1,
    // Will draw squares instead of circle gradients
    fastMode: false,
    gravity: { x: 0, y: 0.1 },
    // sensible values are 0-3
    jitter: 0
};


function arrayCoeficients() {
    var sign = 0.49; // Sign probability
    var degree = 6; // Max degree
    var maxCoeficient = 9; // Max coeficient
    var noTerm = 0.3; // Probability that the term doesn't appear
    var polynomial = []; // The polynomial
    
    while (polynomial.length === 0) {
        for (var i=0; i<degree; i++) {
            if (Math.random() > noTerm) {
                polynomial[i] = Math.floor(Math.random()*(maxCoeficient)+1);
                if (polynomial[i] !== 0) {
                    if (Math.random() < sign) {
                        polynomial[i] = -polynomial[i];
                    }
                } else {
                    delete polynomial[i];
                }
            }
        }
    }
    return polynomial;
}

function buildPolynomial() {
    var coefs = arrayCoeficients();
    var poly = [];
    var i = coefs.length;
    while (i > 0) {
        i--;
        if (coefs[i] !== undefined) {
            poly[i] = "";
            if (coefs[i] > 0) {
                poly[i] = "+";
            }
            if (coefs[i] !== 1 || coefs[i] !== -1) {
                poly[i] = poly[i] + coefs[i];
            }
            if (i > 1) {
                poly[i] = poly[i] + "x<sup>" + i + "</sup> ";
            } else {
                if (i === 1) {
                    poly[i] = poly[i] + "x";
                }
            }
        }
    }
    return poly;
}

function polynomialHtml(n) {
    var html = "<table class='poly'>";
    var polynomials = [];
    var tableLength = 0;
    for (var i=0; i<n; i++) {
        polynomials[i] = buildPolynomial();
        if (polynomials[i].length > tableLength) {
            tableLength = polynomials[i].length;
        }
    }
    var j;
    for (i=0; i<n; i++) {
        j = tableLength;
        html = html + "<tr>";
        while (j > 0) {
            j--;
            if (polynomials[i][j] !== undefined)
                html = html + "<td>" + polynomials[i][j] + "</td>";
            else
                html = html + "<td></td>";
        }
        html = html + "</tr>";
    }
    html = html + "</table>";
    return html;
}

function polynomialKeyboard() {
    var first = true;
    var full = false;
    var sign = false;
    var exponent = false;
    var solutionArray = [];
    var cursor = -1;
    $('body').on("keydown",function(e) {
        var key = e.keyCode || e.which;
        // Numbers
        if (!full) {
           if (key > 47 && key < 58) {
                if (sign) {
                    if (!exponent) {
                        if (key === 48) {
                            if ( ($('#poly' + cursor).text() !== "+") && ($('#poly' + cursor).text() !== "-") )  {
                                $('#poly' + cursor).append(+key-48);
                            }
                        } else {
                            $('#poly' + cursor).append(+key-48);
                        }
                    } else {
                        if (key !== 48) {
                            $('#exp' + cursor).append(+key-48);
                        }
                    }
                } else {
                    // Only enters here once
                    if (first) {
                        if (key !== 48) {
                            cursor++;
                            $('#solution').append("<td id='poly" + cursor +"'>+" + (+key-48) + "</td>");
                            first = false;
                            sign = true;
                        }
                    }
                }
            }
            // Signs
            else if (key === 173 || key === 171) {
                // Only enters here once
                if (first) {
                    cursor++;
                    $('#solution').append("<td id='poly" + cursor +"'>+</td>");
                    first = false;
                    sign = true;
                }
                // If only has a + or -, doesn't do anything
                if ( !( ($("#poly" + cursor).text() === "+") || ($("#poly" + cursor).text() === "-") ) ) {
                    if (exponent) {
                        exponent = false;
                    } else {
                        $('#poly' + cursor).append("<span hidden>x<sup id='exp" + cursor +"'>0</sup></span>");
                    }
                    sign = false;
                    // See if exponent is 1 and delete it
                    if ($('#exp' + cursor).text() === "1") {
                        $('#exp' + cursor).hide();
                    }
                    // See if coeficient is 1 and delete it
                    var number1 = $('#poly' + cursor).html();
                    var ini1 = number1.indexOf("+");
                    var ini2 = number1.indexOf("-");
                    if (ini1 < 0) {
                        number1 = number1.substring(ini2,number1.indexOf("x"));
                    } else {
                        number1 = number1.substring(ini1,number1.indexOf("x"));
                    }
                    if (number1 === "+1" || number1 === "-1") {
                        $('#poly' + cursor).html(number1.substring(0,1) + $('#poly' + cursor).html().substring( $('#poly' + cursor).html().indexOf("x") , $('#poly' + cursor).html().length ));
                    }
                    // Simplify
                    var aux = cursor-1;
                    while (aux > -1) {
                        // Equal exponents
                        if ($('#exp' + aux).html() === $('#exp' + cursor).html()) {
                            // Actual number
                            number1 = $('#poly' + cursor).html();
                            ini1 = number1.indexOf("+");
                            ini2 = number1.indexOf("-");
                            if (ini1 < 0) {
                                number1 = number1.substring(ini2,number1.indexOf("x"));
                            } else {
                                number1 = number1.substring(ini1,number1.indexOf("x"));
                            }
                            // Last number
                            number2 = $('#poly' + aux).html();
                            ini1 = number2.indexOf("+");
                            ini2 = number2.indexOf("-");
                            var html = "";
                            if (ini1 < 0) {
                                number2 = number2.substring(ini2,number2.indexOf("x"));
                                html = "-";
                            } else {
                                number2 = number2.substring(ini1,number2.indexOf("x"));
                                html = "+";
                            }
                            if (number1 === "+" || number1 === "-") number1 += "1";
                            if (number2 === "+" || number2 === "-") number2 += "1";
                            var total = (+parseInt(number1,10) + parseInt(number2,10));
                            if (total < 0) {
                                html="";
                            }
                            $('#poly' + cursor).remove();

                            if (total !== 0) {
                                if (total !== 1) html += total;
                                var exponential = $('#exp' + aux).text();
                                if (exponential === "0") {
                                    html += "<span hidden>x<sup id='exp" + aux+ "'>0</sup></span>";
                                } else {
                                    html += "x<sup id='exp" + aux+ "'>" + exponential +"</sup>";
                                }
                                $('#poly' + aux).html(html);
                                $('#poly' + cursor).remove();
                                cursor--;
                            } else {
                                $('#poly' + aux).remove();
                            }
                        }
                        aux--;
                    }
                    if (!sign) {
                        cursor++;
                        var op;
                        if (key === 173) op = "-";
                        else op = "+";
                        $('#solution').append("<td id='poly" + cursor +"'>" + op + "</td>");
                        sign = true;
                    }
                }
            } // X 
            else if (key === 88) {
                // Only enters here once
                if (first) {
                    cursor++;
                    $('#solution').append("<td id='poly" + cursor +"'>+</td>");
                    first = false;
                    sign = true;
                }
                if (exponent === false) {
                    $('#poly' + cursor).append("x<sup id='exp" + cursor +"'></sup>");
                    exponent = true;
                }
            } // Enter 
        }
        if (key === 13) {
           // enterSolution();
        } // Backspace
        else if (key === 8) {
            e.preventDefault();
            if (cursor > -1) {
                $('#poly' + cursor).remove();
                if ($('#solution').html() === "\n" || $('#solution').html() === "") {
                    first = true;
                }
                cursor--;
                exponent = false;
                sign = false;
            }
        }
        if ($(".solutionbox").outerWidth() <= $(".poly").outerWidth()) {
            $(".solutionbox").css({"border-color":"#000000"});
            full = false;
        } else {
            $(".solutionbox").css({"border-color":"#FF0000"});
            full = true;
        }
    });
}

function dibujarAyuda() {
    var html = "";
    html += '<div id="btn_plus"><img src="/assets/img/keys/plus.png"/><p>Colocar +</p></div>';
    html += '<div id="btn_minus"><img src="/assets/img/keys/minus.png"/><p>Colocar -</p></div>';
    html += '<div id="btn_number"><img src="/assets/img/keys/number.png"/><p>Colocar números</p></div>';
    html += '<div id="btn_x"><img src="/assets/img/keys/x.png"/><p>Colocar x</p></div>';
    html += '<div id="btn_delete"><img src="/assets/img/keys/delete.png"/><p>Borrar</p></div>';
    html += '<div id="btn_enter"><img src="/assets/img/keys/enter.png"/><p>Resolver</p></div>';
    return '<div class="help"><p>Ayuda</p>' + html +'</div>';
}


function enterSolution() {
    for (var i=0; i < $("#solution").children().length; i++) {
        var coeficient = $($("#solution").children()[i]).text();
        var degree = $($("#solution").children()[i]).html();

        var x = coeficient.indexOf("x");
        if (x < 1) {
            coeficient = coeficient.substring(0,degree.indexOf("<"));
        } else {

        }


        degree = degree.substring(degree.indexOf(">")+1,degree.lastIndexOf("<"));
        if (degree === "") degree = 1;
        
        

        console.log(coeficient + "x^" + degree);

    }
    $('.battle').remove();
    $('body').unbind('keydown');
    Crafty('Char').startAll();
    Crafty('Enemy').each(function() {
        this.startAll();
    });
}


// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Initiates the engine.
     */
    init: function(editing) {

        Crafty.c('Char', {
            _jumping: false,
            _up: false,
            _old_x: undefined,
            _falling: false,
            _range: undefined,
            _cronoLava: undefined,
            _health: 100,
            _timeout: 14.99,
            _operations: 5,
            _shield: 0,
            _invisible: false,
            _detected: false,
            _canAttack: false,
            _enemy: undefined,
            jump: function() {
                if(this.isDown(Crafty.keys.UP_ARROW)) {
                    this._jumping = true;
                }
                var obj, hit = false, pos = this.pos();

                pos._y= pos._y-7;

                // map.search wants _x and intersect wants x...
                pos.x = pos._x;
                pos.y = pos._y;
                pos.w = pos._w;
                pos.h = pos._h;

                var q = Crafty.map.search(pos);
                var l = q.length;

                for (var i = 0; i < l; ++i) {
                    obj = q[i];
                    // check for an intersection directly below the player
                    if (obj !== this && obj.has(this._anti) && obj.intersect(pos)) {
                        hit = obj;
                        break;
                    }
                }
                if (hit) { //stop jumping if found and player is moving up
                    this.y = hit._y + this._h; //move object
                    this._falling = true;
                    this._jumping = false;
                    this._up = false;
                } else {
                    if (this._up) {
                        clearInterval(this._cronoLava);
                        this._cronoLava = undefined;
                        Crafty('Particles').each(function() { this.destroy(); });
                        this.y -= 7;
                        this._falling = true;
                    }
                }
                if (this._falling) {
                    if (this._timeFalling++ <= 20 && this._jumping) {
                        this._jumping = false;
                        
                    }
                    else {

                    }
                    this._jumping = false;
                    this._timeFalling = 0;
                }
            },
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
                        Scenes.restartLevel();
                    }
                }
                Crafty("Char")._shield = shield;
                Crafty("Char")._health = health;

            },
            lava: function() {
                var suelo = Crafty.map.search({_x: this.x+16, _y: this.y+32, _w: 1, _h: 1}, true);
                    if (suelo.length > 0) {
                        if (suelo[0].has("Abyss")) {
                            if (this._cronoLava === undefined) {
                                var particulas = 0;
                                this._cronoLava = setInterval( function() {
                                    Crafty.e("2D, Canvas, Particles").attr({"_x": Crafty("Char").x, "_y": Crafty("Char").y+16}).particles(drawLava);
                                    particulas++;
                                    Crafty("Char").damage("lava");                                    
                                    if (particulas % 2 === 0) {
                                        Crafty('Particles').each(function() { this.destroy(); });
                                    }
                                }, 100);

                            }
                        } else {
                            clearInterval(this._cronoLava);
                            Crafty('Particles').each(function() { this.destroy(); });
                            this._cronoLava = undefined;
                        }
                    }
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
               /* Crafty("Char")._enemy.destroy();
                Crafty("Char")._enemy = undefined;*/
                Crafty('Char').stopAll();
                var html = ['<div class="battle">',
                            '<h1>Batalla</h1>',
                            '<h2 class="left">Polinomios:</h2>',
                            '<h2 class="right">Tiempo restante:</h2>',
                            polynomialHtml(2),
                            '<table class="solutionbox"><tr id="solution">',
                            '</tr></table>',
                            '<div id="time">14.99</div>',
                            dibujarAyuda(),
                            '</div>'].join('\n');
                $("#cr-stage").append(html);
                polynomialKeyboard();
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
                        this.jump();
                        this.lava();
                        this.detection();
                        this.verticalScroll();
                    });
                this.bind('Moved', function(from) {
                    this.bounds(from);
                    this.lava();
                    this.horizontalScroll(from);
                });
                this.bind("KeyDown", function () {
                    if (this.isDown("UP_ARROW")){
                        this._up = true;
                        Crafty.trigger("Moved", {x: this.x, y: this.y});
                    }
                    else if (this.isDown("A")) {
                      /*  if (this._canAttack) {
                            if (!this._invisible) {*/
                                this.battle(true);
                      /*      } else {
                                this.battle(false);
                            }
                        }*/
                    }
                    else if (this.isDown("S")) {
                        this.treasure();
                    }
                });
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
            init: function() {
                this.requires('2D, Canvas, SpriteAnimation, Collision, Grid, Gravity, Keyboard, Fourway, spr_char');
                this.z=2;
                if (!editing) {
                    this.startAll();
                }
            }
        });
    }
};

});