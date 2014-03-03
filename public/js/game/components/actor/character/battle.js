// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/battle.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

define (function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var MAX_COEFICIENT = 9; // Maximum coeficient per term.
var SIGN_PROBABILITY = 0.5; // Balanced sign probability +/-
var TERM_PROBABILITY = 0.7; // Probability that a term appears in the polynomial

// Timeouts for battles
var ADD_TIMEOUT = 24.99;
var SUB_TIMEOUT = 34.99;
var MUL_TIMEOUT = 69.99;
var NOT_TIMEOUT = 69.99;
var DIV_TIMEOUT = 99.99;

/**
 * Draws the help panel that shows during battles
 * @returns String - The html code.
 */
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

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Registers the component
     */
    createComponent: function() {
        Crafty.c('Battle', {
            _battleOperation: undefined, // Operation: +,-,*,**,/
            _battleTimed: false, // If has a timeout
            _battleTimeout: undefined, // The timeout
            _battleTimer: undefined, // The setInterval variable
            _battlePolynomials: [], // Array of polynomials
            _battleNotables: [], // Array of notable products. 0 should be the poly. 1 the operation. 2 the type.
            _battleInput: [], // User input
            /**
             * Generates the polynomials and HTML and inserts it into the
             * game, controlling timing and all the events.
             */
            polynomialBattle: function() {
                this.whichOperation();
                this.polynomialArray(0,6);
                var operationString;
                switch (this._battleOperation) {
                    case "*":
                        operationString = "MULTIPLICACIÓN"; this.polynomialArray(1,9,3); break;
                    case "**":
                        polynomialNotableArray(1); break;
                    case "/":
                        operationString = "DIVISIÓN"; polynomialCocientArray(0,2); break;
                    case "+":
                        operationString = "SUMA"; this.polynomialArray(1,9,6); break;
                    case "-":
                        operationString = "RESTA"; this.polynomialArray(1,9,6); break;
                }
                var html = ['<div class="battle"><h1>Batalla</h1>',
                                '<h2 class="left">Operación: ' + operationString + "</h2>",
                                '<h2 class="right">Tiempo restante:</h2>',
                                this.polynomialHtml(),
                                '<table class="solutionbox"><tr id="solution"></tr></table>',
                                '<div id="time">SIN TIEMPO</div>',
                                dibujarAyuda(),
                            '</div>'].join('\n');
                if (this._battleTimed) {
                    $($(".lifebox").children()[2]).show();
                    $($(".lifebox").children()[3]).show();
                    $('#time').text(this._battleTimeout);
                    var time = this._battleTimeout;
                    this._battleTimer = setInterval( function() {
                        time-=0.01;
                        if (time <= 0.0) {
                            Crafty("Character").damage("enemy");
                            time = Crafty("Character")._battleTimeout;
                        }
                        $("#time").text(time.toFixed(2));
                    }, 10);
                }
                $("#cr-stage").append(html);
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
            },
            /**
             * Generates HTML code for the table with the two polynomials.
             * @return String - HTML code
             */
            polynomialHtml: function() {
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
                        if (this._battlePolynomials[position][i] !== 1 || this._battlePolynomials[position][i] !== -1) {
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
             * @param position - Position in the polynomials array.
             * @param maxDegree - Maximum degree of the polynomial.
             * @param maxElements - Maximum number of elements.
             * @return array - The polynomial array.
             */
            polynomialArray: function(position, maxDegree, maxElements) {
                this._battlePolynomials[position] = [];
                while (this._battlePolynomials[position].length === 0) {
                    var i=0;
                    while (i < maxDegree) {
                        if (this._battlePolynomials[position].length >= maxElements) {
                            break;
                        }
                        if (Math.random() <= TERM_PROBABILITY) {
                            this._battlePolynomials[position][i] = Math.floor(Math.random()*(MAX_COEFICIENT)+1);
                            if (Math.random() <= SIGN_PROBABILITY) {
                                this._battlePolynomials[position][i] = -this._battlePolynomials[position][i];
                            }
                        }
                        i++;
                    }
                }
            },
            /**
             * [polynomialNotableArray description]
             * @param  {[type]} position [description]
             * @return {[type]}          [description]
             */
            polynomialNotableArray: function(position) {
                // Notable operation
                if (Math.random() > 0.5) this._battleNotables[1] = "+";
                else this._battleNotableType = "-";

                var notable = [];
                var index1 = 1, index2 = 1;
                while (index1 === index2) {
                    index1 = Math.floor(Math.random()*(maxCoeficient)+1);
                    index2 = Math.floor(Math.random()*(maxCoeficient)+1);
                }
                this._battleNotables[0][index1] = Math.floor(Math.random()*(maxCoeficient)+1);
                this._battleNotables[0][index2] = Math.floor(Math.random()*(maxCoeficient)+1);
                var p = Math.random();
                var indexes = [];
                var j=0;
                if (p < 0.66) {
                    for (var i=0; i<maxCoeficient; i++) {
                        if (this._battleNotables[0][i] !== undefined) {
                            this._battlePolynomials[position][i*2] = this._battleNotables[0][i] * this._battleNotables[0][i];
                            indexes[j] = i;
                            j++;
                        }
                    }
                    if (p < 0.33) {
                        this._battlePolynomials[position][indexes[0] + indexes[1]] = 2*(this._battleNotables[0][indexes[0]] * this._battleNotables[0][indexes[1]]);
                        this._battleNotables[2] = "+";
                    } else {
                        this._battlePolynomials[position][indexes[0] + indexes[1]] = -2*(this._battleNotables[0][indexes[0]] * this._battleNotables[0][indexes[1]]);
                        this._battleNotables[2] = "-";
                    }
                } else {
                    var minDegree = 9999;
                    for (var k=0; k<maxCoeficient; k++) {
                        if (this._battleNotables[0][k] !== undefined) {
                            this._battlePolynomials[position][k*2] = this._battleNotables[0][k] * this._battleNotables[0][k];
                            if (k < minDegree) minDegree = k;
                        }
                    }
                    if (this._battleNotables[0][minDegree] > 0) this._battleNotables[0][minDegree] = -this._battleNotables[0][minDegree];
                    this._battleNotables[2] = "*";
                }
                if (p >= 0.33 && p < 0.66) {
                    if (index1 > index2) {
                        if (this._battleNotables[0][index2] > 0) this._battleNotables[0][index2] = -this._battleNotables[0][index2];
                    } else {
                        if (this._battleNotables[0][index1] > 0) this._battleNotables[0][index1] = -this._battleNotables[0][index1];
                    }
                } else {
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
                var first = true;
                var full = false;
                var sign = false;
                var exponent = false;
                var cursor = -1;
                var inputArray = [], solCoeficient, solExponent;
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
                                        aux = parseInt($('#poly' + cursor).text().substring(0,ps),10);
                                        if (isNaN(aux)) aux = 1;
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
                            var ps = $('#poly' + cursor).text().indexOf("x");
                            var aux2;
                            if (ps < 0) {
                                aux2 = parseInt($('#poly' + cursor).text(),10);
                            } else {
                                aux2 = parseInt($('#poly' + cursor).text().substring(0,ps),10);
                                if (isNaN(aux2)) aux2 = 1;
                                
                            }
                            solCoeficient = aux2;
                            aux2 = parseInt($('#exp' + cursor).text(),10);
                            if (isNaN(aux2)) {
                                if ($('#poly' + cursor).text().indexOf("x") < 0) aux2 = 0;
                                else aux2 = 1;
                            }
                            solExponent = aux2;
                            inputArray[solExponent] = solCoeficient;
                            Crafty("Character")._inputSolution = inputArray;
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
            },
            /**
             * Given a polynomial, makes another by multiplying it to another
             * random polynomial, and stores this random polynomial.
             * @param poly - Polynomial to multiply
             * @param maxElements- Number of terms of the random polynomial.
             */
            polynomialCocientArray: function(poly, maxElements) {
                this._battlePolynomials[1] = this._battlePolynomials[0];
                var toMultiply = this.polynomialArray(MAX_COEFICIENT, maxElements);
                var result = [];
                // Starts in 1 to avoid constants
                delete Crafty("Char")._polinomios[1][0];
                for (var i=1; i<MAX_COEFICIENT; i++) {
                    if (poly[i] !== undefined) {
                        for (var j=1; j<MAX_COEFICIENT; j++) {
                            if (toMultiply[j] !== undefined) {
                                if (result[i+j] === undefined) result[i+j] = 0;
                                result[i+j] = result[i+j] + poly[i]*toMultiply[j];
                            }
                        }
                    }
                }
                Crafty("Char")._polinomios[5] = toMultiply;
                return result;
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
                        switch(Crafty("Char")._polinomios[5]) {
                            case "+":
                                for (i=0; i<MAX_COEFICIENT; i++) {
                                    if (this._battlePolynomials[0][i] === undefined) this._battlePolynomials[0][i] = 0;
                                    if (this._battlePolynomials[1][i] === undefined) this._battlePolynomials[1][i] = 0;
                                    if (this._battleInput[i] === undefined) input[i] = 0;
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
                        this._battlePolynomials[0] = Crafty("Char")._polinomios[5];
                        for (i=0; i<MAX_COEFICIENT; i++) {
                            if (this._battlePolynomials[0][i] !== undefined) {
                                correct = (this._battlePolynomials[0][i] === this._battleInput[i]);
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
                }
                this.clearBattle();
                if (correct) {
                    if (this.getEnemy().damage()) {
                        this.startAll();
                    }
                }
                else {
                    this.damage("enemy");
                }
                this.battle(this._battleTimed);
                
            },
            /**
             * Trigger for entering a battle
             * @return {[type]} [description]
             */
            battle: function(timed) {
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