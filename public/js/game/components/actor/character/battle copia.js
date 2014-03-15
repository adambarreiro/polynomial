// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/battle.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------
/**
 * battle.js
 * @dependency /public/js/game/audio.js
 */
define (["../../../audio"], function(Audio) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var MAX_COEFICIENT = 9; // Maximum coeficient per term.
var SIGN_PROBABILITY = 0.5; // Balanced sign probability +/-
var TERM_PROBABILITY = 0.7; // Probability that a term appears in the polynomial

// Timeouts for battles
var ADD_TIMEOUT = 2999;
var SUB_TIMEOUT = 2999;
var MUL_TIMEOUT = 14999;
var NOT_TIMEOUT = 14999;
var DIV_TIMEOUT = 15999;

// Timeout bonus
var BONUS_TIMEOUT = 3000;

// Result screen time
var RESULT_SCREEN = 100;
var CORRECT_SCREEN = "rgba(0,255,0,0.8)";
var WRONG_SCREEN = "rgba(255,0,0,0.8)";
var NORMAL_SCREEN = "rgba(200,200,200,0.8)";

/**
 * Draws the help panel that shows during battles
 * @returns String - The html code.
 */
function dibujarAyuda() {
    var html = "";
    html += '<div id="btn_plus"><img src="/assets/img/game/keys/plus.png"/><p>Colocar +</p></div>';
    html += '<div id="btn_minus"><img src="/assets/img/game/keys/minus.png"/><p>Colocar -</p></div>';
    html += '<div id="btn_number"><img src="/assets/img/game/keys/number.png"/><p>Colocar números</p></div>';
    html += '<div id="btn_x"><img src="/assets/img/game/keys/x.png"/><p>Colocar x</p></div>';
    html += '<div id="btn_delete"><img src="/assets/img/game/keys/delete.png"/><p>Borrar</p></div>';
    html += '<div id="btn_enter"><img src="/assets/img/game/keys/enter.png"/><p>Resolver</p></div>';
    return '<div class="help"><p>Ayuda</p>' + html +'</div>';
}

/**
 * Solves key equivalents and different keymaps between browsers
 */
function keyMap(key) {
    var newKey = key;
    if (key >= 96 && key <= 105) {
        // Numeric keyboard
        newKey = key - 48;
    } else if (key === 109) {
        // + in numeric keyboard
        newKey=173;
    }
    else if (key === 107) {
        // - in numeric keyboard
        newKey=171;
    }
    else if (key === 187) {
        // Chrome mapping -
        newKey = 171;
    }
    else if (key === 189) {
        // Chrome mapping +
        newKey = 173;
    }
    return newKey;
}

function parseExponent(content) {
    var symbol = content.indexOf("^");
    return content.substring(0,symbol) + "<sup>" + content.substring(symbol+1, content.length) + "</sup>";
}

function parseSolution(content) {
    var parsed = [];
    var i;
    var input = content.split("</sup>");
    for (i=0; i<input.length;i++) {
        var parts = input[i].split("<sup>");
        if (parsed[parts[1]] === undefined) {
            parsed[parts[1]] = parseInt(parts[0].replace("x",""),10);
        } else {
            parsed[parts[1]] += parseInt(parts[0].replace("x",""),10);
        }
    }
    console.log(parsed);
    return parsed;
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Registers the component
     */
    createComponent: function() {
        Crafty.c('Battle', {
            _battleFighting: false, // If we're currently in a fight.
            _battleOperation: undefined, // Operation: +,-,*,**,/
            _battleTimed: false, // If has a timeout
            _battleTimeout: undefined, // The timeout
            _battleTimer: undefined, // The setInterval variable
            _battlePolynomials: [[],[]], // Array of 2 polynomials
            _battleNotables: [[],"",""], // Array of notable products. 0 should be the poly. 1 the operation. 2 the type.
            _battleQuotient: [], //  The quotient if it's a quotient operation
            _battleInput: [], // User input
            _battleResult: undefined,
            /**
             * Generates the polynomials and HTML and inserts it into the
             * game, controlling timing and all the events.
             */
            polynomialBattle: function() {
                this.whichOperation();
                this._battlePolynomials[0] = this.polynomialArray(9,6);
                var operationString;
                switch (this._battleOperation) {
                    case "*":
                        operationString = "MULTIPLICACIÓN"; this._battlePolynomials[1] = this.polynomialArray(9,3); break;
                    case "**":
                        this.polynomialNotableArray(1);
                        if (this._battleNotables[1] === "+") {
                            operationString = "SUMA";
                        } else {
                            operationString = "RESTA";
                        }
                        break;
                    case "/":
                        operationString = "DIVISIÓN"; this.polynomialCocientArray(2); break;
                    case "+":
                        operationString = "SUMA"; this._battlePolynomials[1] = this.polynomialArray(9,6); break;
                    case "-":
                        operationString = "RESTA"; this._battlePolynomials[1] = this.polynomialArray(9,6); break;
                }
                var html = ['<div class="battle"><h1>Batalla</h1>',
                                '<h2 class="left">Operación: <span style="color:#FF0000">' + operationString + "</span></h2>",
                                '<h2 class="right">Tiempo restante:</h2>',
                                this.polynomialHtml(),
                                '<table class="solutionbox"><tr id="solution"></tr></table>',
                                '<div id="time">' + this._battleTimeout + '</div>',
                                dibujarAyuda(),
                            '</div>'].join('\n');
                $("#cr-stage").append(html);
                $(".solutionbox").width($(".poly").width());
                $('#enemybar').css({"width": (this._detectionEnemy._enemyHealth*3) + "px"});
                $($(".lifebox").children()[2]).show();
                $($(".lifebox").children()[3]).show();
                if (this._battleResult !== undefined) {
                    battleResultScreen = RESULT_SCREEN;
                    if (this._battleResult) $(".battle").css({"background": CORRECT_SCREEN});
                    else $(".battle").css({"background": WRONG_SCREEN});
                }
                if (this._battleTimed) {
                    var time = this._battleTimeout;
                    var battleResultScreen = 0;
                    $("#time").css({"text": "#FF0000"});
                } else {
                    $("#time").css({"text": "#00FF00"}).text("∞");
                }
                var before = new Date();
                this._battleTimer = setInterval( function() {
                    var elapsedTime = (new Date().getTime() - before.getTime());
                    if (Crafty("Character")._battleTimed) {
                        if(elapsedTime > 100) {
                            time-=parseInt(elapsedTime/10,10);
                            if (battleResultScreen > 0) battleResultScreen-=parseInt(elapsedTime/10,10);
                        } else {
                            time-=1;
                            if (battleResultScreen > 0) battleResultScreen-=1;
                        }
                        if (time <= 0) {
                            Crafty("Character").clearBattle();
                            Crafty("Character")._battleResult = false;
                            if (Crafty("Character")._health > 0) Crafty("Character").battle(Crafty("Character")._battleTimed);
                            Crafty("Character").damage("enemy");
                        } else if (battleResultScreen <= 0) {
                            $(".battle").css({"background": NORMAL_SCREEN});
                            battleResultScreen = 0;
                        }
                        $("#time").text((time/100).toFixed(2));
                    } else {
                        if(elapsedTime > 100) {
                            if (battleResultScreen > 0) battleResultScreen-=parseInt(elapsedTime,10);
                        } else {
                            if (battleResultScreen > 0) battleResultScreen-=10;
                        }
                        if (battleResultScreen <= 0) {
                            $(".battle").css({"background": NORMAL_SCREEN});
                            battleResultScreen = 0;
                        }
                    }
                    before = new Date();
                },10);
                
            },
            /**
             * Determines the battle operation depending on the enemy spotted. Stores
             * this operation in the entity.
             */
            whichOperation: function() {
                var enemy = this.getEnemy();
                if (enemy.has("Enemy1")) {
                    this._battleTimeout = ADD_TIMEOUT;
                    this._battleOperation = "+";
                } else if (enemy.has("Enemy2")) {
                    this._battleTimeout = SUB_TIMEOUT;
                    this._battleOperation = "-";
                }  else if (enemy.has("Enemy3")) {
                    this._battleTimeout = MUL_TIMEOUT;
                    this._battleOperation = "*";
                }  else if (enemy.has("Enemy4")) {
                    this._battleTimeout = NOT_TIMEOUT;
                    this._battleOperation = "**";
                }  else if (enemy.has("Enemy5")) {
                    this._battleTimeout = DIV_TIMEOUT;
                    this._battleOperation = "/";
                }
                if (this._bonusTime > 0) {
                    this._battleTimeout += BONUS_TIMEOUT;
                }
            },
            /**
             * Generates HTML code for the table with the two polynomials.
             * @return String - HTML code
             */
            polynomialHtml: function() {
                console.log(this._bonusTime);
                var html = "<table class='poly'><tr>";
                var i;
                var poly1 = this.buildPolynomial(0);
                var poly2;
                var length = poly1.length;
                // If notable product, build the notable.
                switch (this._battleOperation) {
                    case "**": poly2 = this.buildNotable(); break;
                    default:
                        poly2 = this.buildPolynomial(1);
                        // If poly2 is larger update the length in order
                        // to print both correctly.
                        if (length < poly2.length) length = poly2.length;
                        break;
                }
                // Print the first polynomial
                for (i=length;i>=0;i--) {
                    if (poly1[i] !== undefined) {
                        html += "<td>" + poly1[i] + "</td>";
                    } else {
                        html += "<td></td>";
                    }
                }
                html += "</tr><tr>";
                // If the second is a notable product, print it directly.
                switch (this._battleOperation) {
                    case "**":
                        html += "<td colspan=" + length + ">" + poly2 + "</td>";
                        break;
                    default:
                        for (i=length;i>=0;i--) {
                            if (poly2[i] !== undefined) {
                                html += "<td>" + poly2[i] + "</td>";
                            } else {
                                html += "<td></td>";
                            }
                        }
                        break;
                }
                html += "</tr></table>";
                return html;
            },
            /**
             * Makes an array with HTML code for a term per element.
             * @param position - The position in the array of polynomials.
             * @return Array - HTML codes
             */
            buildPolynomial: function(position) {
                var poly = [];
                var i = this._battlePolynomials[position].length;
                while (i > 0) {
                    i--;
                    if (this._battlePolynomials[position][i] !== undefined) {
                        poly[i] = "";
                        if (this._battlePolynomials[position][i] > 0) {
                            poly[i] = "+";
                        }
                        if (this._battlePolynomials[position][i] !== 1 && this._battlePolynomials[position][i] !== -1) {
                            poly[i] = poly[i] + this._battlePolynomials[position][i];
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
            },
            /**
             * Builds an HTML string for a notable product with a polynomial array.
             */
            buildNotable: function() {
                var html = "(";
                var aux = [];
                var i;
                switch(this._battleNotables[2]) {
                    case "*":
                        var mirror = "";
                        for (i=this._battleNotables[0].length; i>0; i--) {
                            if (this._battleNotables[0][i] !== undefined) {
                                if (this._battleNotables[0][i] > 0) mirror+= "+";
                                if (this._battleNotables[0][i] !== -1 && this._battleNotables[0][i] !== 1)
                                    mirror+= this._battleNotables[0][i];
                                if (i > 0) {
                                    mirror+= "x";
                                    if (i > 1) mirror+="<sup>" + i + "</sup>&nbsp;";
                                    else mirror+="&nbsp;";
                                }
                                
                            }
                        }
                        html+=mirror + ")(+" + mirror.replace("+","-").replace("+","-").substring(1,mirror.length)  + ")";
                        break;
                    default:
                        for (i=this._battleNotables[0].length; i>0; i--) {
                            if (this._battleNotables[0][i] !== undefined) {
                                if (this._battleNotables[0][i] > 0) html+= "+";
                                if ((this._battleNotables[0][i] !== -1) && (this._battleNotables[0][i] !== 1))
                                    html+= this._battleNotables[0][i];
                                if (this._battleNotables[0][i] === -1) html+= "-";
                                if (i > 0) {
                                    html+= "x";
                                    if (i > 1) html+="<sup>" + i + "</sup>&nbsp;";
                                    else html+="&nbsp;";
                                }
                            }
                        }
                        html+=")<sup>2</sup>".replace(/\n/g, '');
                        break;
                }
                return html;
            },
            /**
             * Makes an array with a coeficient per element, being the element the i-th exponent.
             * @param maxDegree - Maximum degree of the polynomial.
             * @param maxElements - Maximum number of elements.
             * @return array - The polynomial array.
             */
            polynomialArray: function(maxDegree, maxElements) {
                polyArray = [];
                while (polyArray.length === 0) {
                    var i=0;
                    while (i < maxDegree) {
                        if (polyArray.length >= maxElements) {
                            break;
                        }
                        if (Math.random() <= TERM_PROBABILITY) {
                            polyArray[i] = Math.floor(Math.random()*(MAX_COEFICIENT)+1);
                            if (Math.random() <= SIGN_PROBABILITY) {
                                polyArray[i] = -polyArray[i];
                            }
                        }
                        i++;
                    }
                }
                return polyArray;
            },
            /**
             * [polynomialNotableArray description]
             * @param  {[type]} position [description]
             * @return {[type]}          [description]
             */
            polynomialNotableArray: function(position) {
                // Notable operation
                this._battleNotables[0] = [];
                if (Math.random() > 0.5) this._battleNotables[1] = "+";
                else this._battleNotables[1] = "-";
                var notable = [];
                var index1 = 1, index2 = 1;
                while (index1 === index2) {
                    index1 = Math.floor(Math.random()*(3)+1);
                    index2 = Math.floor(Math.random()*(3)+1);
                }
                this._battleNotables[0][index1] = Math.floor(Math.random()*(4)+1);
                this._battleNotables[0][index2] = Math.floor(Math.random()*(4)+1);
                var p = Math.random();
                var indexes = [];
                var j=0;
                if (p < 0.66) {
                    // Primer termino al cuadrado y segundo termino al cuadrado
                    for (var i=0; i<MAX_COEFICIENT; i++) {
                        if (this._battleNotables[0][i] !== undefined) {
                            this._battlePolynomials[position][i*2] = this._battleNotables[0][i] * this._battleNotables[0][i];
                            indexes[j] = i;
                            j++;
                        }
                    }
                    if (p < 0.33) {
                        // Más el doble del primero por el segundo
                        this._battlePolynomials[position][indexes[0] + indexes[1]] = 2*(this._battleNotables[0][indexes[0]] * this._battleNotables[0][indexes[1]]);
                        this._battleNotables[2] = "+";
                    } else {
                        // Menos el doble del primero por el segundo
                        this._battlePolynomials[position][indexes[0] + indexes[1]] = -2*(this._battleNotables[0][indexes[0]] * this._battleNotables[0][indexes[1]]);
                        this._battleNotables[2] = "-";
                    }
                } else {
                    var minDegree = 9999;
                    // Suma por diferencia, diferencia de cuadrados:
                    // Al cuadrado
                    for (var k=0; k<MAX_COEFICIENT; k++) {
                        if (this._battleNotables[0][k] !== undefined) {
                            this._battlePolynomials[position][k*2] = this._battleNotables[0][k] * this._battleNotables[0][k];
                            if (k < minDegree) minDegree = k;
                        }
                    }
                    // Si quedara positiva, la volvemos negativa.
                    if (this._battleNotables[0][minDegree] > 0) this._battleNotables[0][minDegree] = -this._battleNotables[0][minDegree];
                    this._battleNotables[2] = "*";
                }
                // Se controla que si es de la forma (ax-b)^2 no quede el termino 2*a*b*x negativo.
                if (p >= 0.33 && p < 0.66) {
                    if (index1 > index2) {
                        if (this._battleNotables[0][index2] > 0) this._battleNotables[0][index2] = -this._battleNotables[0][index2];
                    } else {
                        if (this._battleNotables[0][index1] > 0) this._battleNotables[0][index1] = -this._battleNotables[0][index1];
                    }
                } else {
                    // Al revés, se controla que siempre sean positivos en el resto de casos.
                    if (index1 > index2) {
                        this._battleNotables[0][index2] = Math.abs(this._battleNotables[0][index2]);
                    } else {
                        this._battleNotables[0][index1] = Math.abs(this._battleNotables[0][index1]);
                    }
                }
            },
            /**
             * Creates a keyboard for introducing polynomials
             */
            polynomialKeyboard: function() {
                var full = false;
                var exponent = false;
                var sign = false;
                $('body').on("keydown",function(e) {
                    if (!full) {
                        var key = keyMap(e.keyCode || e.which);
                        // Numbers
                        if (key >= 48 && key <= 57) {
                            $('#solution').append(+key-48);
                            if (exponent) {
                                $('#solution').html(parseExponent($('#solution').html()));
                                exponent = false;
                            }
                            sign = false;
                        }
                        // X
                        else if (key === 88) {
                            if (!exponent) {
                                $('#solution').append("x");
                            }
                            sign = false;
                        }
                        // ^
                        else if (e.shiftKey && key === 192) {
                            if (!exponent) {
                                $('#solution').append("^");
                                exponent = true;
                            }
                            sign = false;
                        }
                        // -
                        else if (key === 173) {
                            if (!exponent && !sign) {
                                $('#solution').append("-");
                                sign = true;
                            }
                        }
                        // +
                        else if (key === 171) {
                            if (!exponent && !sign) {
                                $('#solution').append("+");
                                sign = true;
                            }
                        }
                        // Enter
                        else if (key === 13) {
                            if (!exponent) {
                                Crafty("Character")._battleInput = parseSolution($('#solution').html());
                            }
                        }
                        // Backspace
                        if (key === 8) {
                            e.preventDefault();
                            var content = $('#solution').html();
                            if ( content.lastIndexOf(">") === content.length-1) {
                                $("#solution").html(content.substring(0,content.lastIndexOf("x")));
                                exponent = false;
                            } else {
                                $("#solution").html(content.substring(0,content.length-1));
                            }
                            sign = false;
                        }
                        // Check fullness of the input box
                        if ($(".solutionbox").outerWidth() <= $(".battle").outerWidth()) {
                            $(".solutionbox").css({"border-color":"#000000"});
                            full = false;
                        } else {
                            $(".solutionbox").css({"border-color":"#FF0000"});
                            full = true;
                        }
                    }

                    
                    
                });
            },
            
            /*
            polynomialKeyboard: function() {
                var first = true;
                var full = false;
                var sign = false;
                var exponent = false;
                var cursor = -1;
                var inputArray = [], solCoeficient, solExponent;
                $('body').on("keydown",function(e) {
                   
                    // Numbers
                    if (!full) {
                        var key = keyMap(e.keyCode || e.which);
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
                                    } else {
                                        if ($('#exp' + cursor).text() !== "") {
                                            $('#exp' + cursor).append(+key-48);
                                        }
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
                                if (key === 173) $('#solution').append("<td id='poly" + cursor +"'>-</td>");
                                else $('#solution').append("<td id='poly" + cursor +"'>+</td>");
                                first = false;
                                sign = true;
                            }
                            // If only has a + or -, doesn't do anything
                            if ( !( ($("#poly" + cursor).text() === "+") || ($("#poly" + cursor).text() === "-") ) ) {
                                if (exponent) {
                                    exponent = false;
                                }
                                sign = false;
                                // See if exponent is 1 and remove it
                                if ($('#exp' + cursor).text() === "1") {
                                    $('#exp' + cursor).text("");
                                }
                                // See if coeficient is 1 and hide it
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
                                            if (exponential !== "0") {
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
                                    // Solution saving
                                    var ps = $('#poly' + cursor).text().indexOf("x");
                                    if (ps < 0) {
                                        aux = parseInt($('#poly' + cursor).text(),10);
                                    } else {
                                        aux = $('#poly' + cursor).text().substring(0,ps);
                                        if (aux === "+") {
                                            aux = 1;
                                        } else if (aux === "-") {
                                            aux = -1;
                                        } else {
                                            aux = parseInt(aux,10);
                                        }
                                    }
                                    solCoeficient = aux;
                                    aux = parseInt($('#exp' + cursor).text(),10);
                                    if (isNaN(aux)) {
                                        if ($('#poly' + cursor).text().indexOf("x") < 0) aux = 0;
                                        else aux = 1;
                                    }
                                    solExponent = aux;
                                    inputArray[solExponent] = solCoeficient;
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
                        if ($("#solution").text() !== "\n" && $("#solution").text() !== "") {
                            // Solution saving
                            var ps2 = $('#poly' + cursor).text().indexOf("x");
                            var aux2;
                            if (ps2 < 0) {
                                aux2 = parseInt($('#poly' + cursor).text(),10);
                            } else {
                                aux2 = $('#poly' + cursor).text().substring(0,ps2);
                                if (aux2 === "+") {
                                    aux2 = 1;
                                } else if (aux2 === "-") {
                                    aux2 = -1;
                                } else {
                                    aux2 = parseInt(aux2,10);
                                }
                            }
                            solCoeficient = aux2;
                            aux2 = parseInt($('#exp' + cursor).text(),10);
                            if (isNaN(aux2)) {
                                if ($('#poly' + cursor).text().indexOf("x") < 0) aux2 = 0;
                                else aux2 = 1;
                            }
                            solExponent = aux2;
                            inputArray[solExponent] = solCoeficient;
                            Crafty("Character")._battleInput = inputArray;
                            Crafty("Character").polynomialSolution();
                        }
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
                    if ($(".solutionbox").outerWidth() <= $(".battle").outerWidth()) {
                        $(".solutionbox").css({"border-color":"#000000"});
                        full = false;
                    } else {
                        $(".solutionbox").css({"border-color":"#FF0000"});
                        full = true;
                    }
                });
            },*/
            /**
             * Given a polynomial, makes another by multiplying it to another
             * random polynomial, and stores this random polynomial.
             * @param poly - Polynomial to multiply
             * @param maxElements- Number of terms of the random polynomial.
             */
            polynomialCocientArray: function(maxElements) {
                this._battlePolynomials[1] = this._battlePolynomials[0];
                var toMultiply = this.polynomialArray(MAX_COEFICIENT, maxElements);
                var result = [];
                // Starts in 1 to avoid constants
                delete this._battlePolynomials[0][0];
                for (var i=1; i<MAX_COEFICIENT; i++) {
                    if (this._battlePolynomials[0][i] !== undefined) {
                        for (var j=1; j<MAX_COEFICIENT; j++) {
                            if (toMultiply[j] !== undefined) {
                                if (result[i+j] === undefined) result[i+j] = 0;
                                result[i+j] = result[i+j] + this._battlePolynomials[0][i]*toMultiply[j];
                            }
                        }
                    }
                }
                this._battleQuotient = toMultiply;
                this._battlePolynomials[0] = result;
            },
            /**
             * Checks the input with the solution.
             */
            polynomialSolution: function() {
                var i, j;
                var solution = [];
                var correct = true;
                switch(this._battleOperation) {
                    case "*":
                        for (i=0; i<MAX_COEFICIENT; i++) {
                            if (this._battlePolynomials[0][i] !== undefined) {
                                for (j=0; j<MAX_COEFICIENT; j++) {
                                    if (this._battlePolynomials[1][j] !== undefined) {
                                        if (solution[i+j] === undefined) solution[i+j] = 0;
                                        solution[i+j] = solution[i+j] + this._battlePolynomials[0][i]*this._battlePolynomials[1][j];
                                        correct = (solution[i+j] === this._battleInput[i+j]);
                                    }
                                }
                            }
                        }
                        break;
                    case "**":
                        switch(this._battleNotables[1]) {
                            case "+":
                                for (i=0; i<MAX_COEFICIENT; i++) {
                                    if (this._battlePolynomials[0][i] === undefined) this._battlePolynomials[0][i] = 0;
                                    if (this._battlePolynomials[1][i] === undefined) this._battlePolynomials[1][i] = 0;
                                    if (this._battleInput[i] === undefined) this._battleInput[i] = 0;
                                    solution[i] = this._battlePolynomials[0][i] + this._battlePolynomials[1][i];
                                    correct = (solution[i] === this._battleInput[i]);
                                    if (!correct) break;
                                }
                                break;
                            case "-":
                                for (i=0; i<MAX_COEFICIENT; i++) {
                                    if (this._battlePolynomials[0][i] === undefined) this._battlePolynomials[0][i] = 0;
                                    if (this._battlePolynomials[1][i] === undefined) this._battlePolynomials[1][i] = 0;
                                    if (this._battleInput[i] === undefined) this._battleInput[i] = 0;
                                    solution[i] = this._battlePolynomials[0][i] - this._battlePolynomials[1][i];
                                    correct = (solution[i] === this._battleInput[i]);
                                    if (!correct) break;
                                }
                                break;
                            default: break;
                        }
                        break;
                    case "/":
                        for (i=0; i<MAX_COEFICIENT; i++) {
                            if (this._battleQuotient[i] !== undefined) {
                                correct = (this._battleQuotient[i] === this._battleInput[i]);
                            }
                        }
                        break;
                    case "+":
                        for (i=0; i<MAX_COEFICIENT; i++) {
                            if (this._battlePolynomials[0][i] === undefined) this._battlePolynomials[0][i] = 0;
                            if (this._battlePolynomials[1][i] === undefined) this._battlePolynomials[1][i] = 0;
                            if (this._battleInput[i] === undefined) this._battleInput[i] = 0;
                            solution[i] = this._battlePolynomials[0][i] + this._battlePolynomials[1][i];
                            correct = (solution[i] === this._battleInput[i]);
                            if (!correct) {
                                break;
                            }
                        }
                        break;
                    case "-":
                        for (i=0; i<MAX_COEFICIENT; i++) {
                            if (this._battlePolynomials[0][i] === undefined) this._battlePolynomials[0][i] = 0;
                            if (this._battlePolynomials[1][i] === undefined) this._battlePolynomials[1][i] = 0;
                            if (this._battleInput[i] === undefined) this._battleInput[i] = 0;
                            solution[i] = this._battlePolynomials[0][i] - this._battlePolynomials[1][i];
                            correct = (solution[i] === this._battleInput[i]);
                            if (!correct) break;
                        }
                        break;
                }
                this.clearBattle();
                if (correct) {
                    this._battleResult = true;
                    var endBattle = this.getEnemy().damage();
                    if (endBattle) {
                        Audio.stopAlert();
                        Audio.stopHidden();
                        Audio.playLevel();
                        if (this._bonusTime > 0) {
                            this._bonusTime--;
                            if (this._bonusTime === 0) {
                                this.removeBonus("clock");
                            }
                        }
                        this._battleFighting = false;
                        this.startAll();
                    } else {
                        if (this._health > 0) this.battle(this._battleTimed);
                    }
                }
                else {
                    if (!this._battleTimed) {
                        Audio.stopHidden();
                        Audio.playAlert();
                    }
                    this.damage("enemy");
                    $('#timeout').css({"color":"red",  "border-color" : "red"});
                    $('#timeout').html("ALERTA MÁXIMA, ¡TE HAN PILLADO!");
                    this._battleResult = false;
                    this._battleTimed = true;
                    if (this._health > 0) {
                        this.battle(this._battleTimed);
                    }
                }
            },
            /**
             * Trigger for entering a battle
             * @return {[type]} [description]
             */
            battle: function(timed) {
                this._battleFighting = true;
                if (timed) {
                    Audio.playMonsterScream();
                }
                this._battleTimed = timed;
                // Stops the game
                this.stopAll();
                this.polynomialBattle();
                this.polynomialKeyboard();
            },
            /**
             * Clears the battle events.
             */
            clearBattle: function() {
                clearInterval(this._battleTimer);
                $(".battle").remove();
                $("body").unbind("keydown");
            },
            /**
             * Inits the component
             */
            init: function() {
                this.requires('Character');
            }
        });
    }
};

});