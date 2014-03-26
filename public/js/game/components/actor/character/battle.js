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
// Polynomials configuration
var MAX_COEFICIENT = 9; // Maximum coeficient per monomial.
var MAX_DEGREE = 6; // Maximum degree of the polynomial.
var MAX_ELEMENTS = 4; // Maximum number of monomials in the polynomial
var SIGN_PROBABILITY = 0.5; // Monomial sign probability.
var TERM_PROBABILITY = 0.75; // Probability that a term appears in the polynomial

// Timeouts for battles
var TIMEOUT_SET = false;
var ADD_TIMEOUT = 2999;
var SUB_TIMEOUT = 2999;
var MUL_TIMEOUT = 15999;
var NOT_TIMEOUT = 2999;
var DIV_TIMEOUT = 14999;

// Timeout bonus
var BONUS_TIMEOUT = 3000;

// Result screen time
var RESULT_SCREEN = 100;
var CORRECT_SCREEN = "rgba(0,255,0,0.8)";
var WRONG_SCREEN = "rgba(255,0,0,0.8)";
var NORMAL_SCREEN = "rgba(200,200,200,0.8)";

function getTimeouts(callback) {
    $.ajax({
        url: '/getTimeoutsFile',
        type: 'POST',
        dataType: 'html',
        success: function(data) {
            var array = data.split(/\n/);
            for (var i=0; i<array.length; i++) {
                var option = array[i].split(":");
                if (option[1] !== undefined && option[1] !== "") {
                    var value = parseInt(option[1],10);
                    if (!isNaN(value)) {
                        switch(option[0]) {
                            case "SUMA": ADD_TIMEOUT = value; break;
                            case "RESTA": SUB_TIMEOUT = value; break;
                            case "MULTIPLICACION": MUL_TIMEOUT = value; break;
                            case "NOTABLE": NOT_TIMEOUT = value; break;
                            case "DIVISION": DIV_TIMEOUT = value; break;
                        }
                    }
                }
            }
            callback();
        }
    });
}

/**
 * Makes an array with a coeficient per element, being the element the i-th exponent.
 * @return array - The polynomial array.
 */
function polynomialArray() {
    var array = [];
    var vacio = true;
    var unidad = true;
    while (vacio || unidad) {
        array = [];
        unidad = true;
        vacio = true;
        for (i=0; i < MAX_DEGREE; i++) {
            if (array.length < MAX_ELEMENTS) {
                if (Math.random() <= TERM_PROBABILITY) {
                    array[i] = Math.floor(Math.random()*(MAX_COEFICIENT)+1);
                    if (Math.random() <= SIGN_PROBABILITY) {
                        array[i] = -array[i];
                    }
                    vacio = false;
                    if (i > 0) {
                        unidad = false;
                    }
                } else {
                    array[i] = 0;
                }
            } else {
                array[i] = 0;
            }
        }
    }
    return array;
}

/**
 * Makes the HTML code for a polynomial
 * @param position - Position in the character polynomial array.
 * @returns HTML code for the polynomial.
 */
function polynomialHtml(array) {
    var html = [];
    for (var i=0; i<array.length; i++) {
        html[i] = "";
        if (array[i] !== 0) {
            // Sign
            if (array[i] > 0) {
                html[i] += "+";
            }
            // Coeficient
            if (array[i] === -1 && i !== 0) {
                html[i] += "-";
            } else if (!(array[i] === 1 && i !== 0)) {
                html[i] += array[i];
            }
            // Exponent
            if (i > 0) {
                html[i]+="x";
                if (i > 1) {
                    html[i] += "<sup>" + i + "</sup>";
                }
            }
        }
    }
    return html.reverse().join(" ").trim();
}

/**
 * Creates a compressed notable product and its solution
 */
function notableArray() {
    var maxDegree = Math.floor(MAX_DEGREE/2); // Maximum degree of the notable.
    var type = Math.floor(Math.random()*(3)+1); // Type of the notable (Probability)
    // Initialize arrays
    var result = [];
    var array = [];
    for (var i=0; i<MAX_DEGREE; i++) {
        array[i] = 0;
        result[i] = 0;
    }
    // Build the exponents
    var exponents = [0,0];
    while (exponents[0] === exponents[1]) {
        exponents = [Math.floor(Math.random()*(maxDegree)+1),Math.floor(Math.random()*(maxDegree)+1)];
    }
    // Build the notable
    var coeficients = [0,0];
    coeficients = [Math.floor(Math.random()*(MAX_COEFICIENT)+1),Math.floor(Math.random()*(MAX_COEFICIENT)+1)];
    // Build the notable
    array[exponents[0]] = coeficients[0];
    array[exponents[1]] = coeficients[1];
    // Build the result array
    switch(type) {
        case 1: // Square difference, +
            result[exponents[0]*2] = coeficients[0] * coeficients[0];
            result[exponents[1]*2] = coeficients[1] * coeficients[1];
            result[exponents[0]+exponents[1]] = 2* coeficients[0] * coeficients[1];
            break;
        case 2: // Square difference, -
            result[exponents[0]*2] = coeficients[0] * coeficients[0];
            result[exponents[1]*2] = coeficients[1] * coeficients[1];
            result[exponents[0]+exponents[1]] = -2* coeficients[0] * coeficients[1];
            array[exponents[1]] = -coeficients[1];
            break;
        case 3: // Addition per substract
            result[exponents[0]*2] = coeficients[0] * coeficients[0];
            result[exponents[1]*2] = -coeficients[1] * coeficients[1];
            array[exponents[1]] = -coeficients[1];
            break;
    }
    return [array, result, type];
}
/**
 * Creates an compressed notable product and its solution
 */
function notableCompressed() {
    var notable = notableArray();
    Crafty("Character")._battleSolution = notable[1];
    return notablePolynomialHtml(notable[0], notable[2]);
}

/**
 * Creates an uncompressed notable product and its solution
 */
function notableUncompressed() {
    var notable = notableArray();
    Crafty("Character")._battleSolution = notable[0];
    return polynomialHtml(notable[1]);
}

/**
 * Makes the HTML code for a notable product.
 * @param array - The polynomial.
 * @param type - Type of the notable product.
 * @returns HTML code for the polynomial.
 */
function notablePolynomialHtml(array, type) {
    switch(type) {
        case 3:
            html = "(" + polynomialHtml(array) + ")".replace(/\n/g,"");
            for (var i=0; i<array.length;i++) {
                if (array[i] < 0) array[i] = -array[i];
            }
            html += "(" + polynomialHtml(array) + ")".replace(/\n/g,"");
            break;
        default: // Addition per substract
            html = "("+polynomialHtml(array)+")<sup>2</sup>".replace(/\n/g,"");
            break;
    }
    return html;
}

/**
 * Makes the HTML code for a notable product.
 * @param array - The polynomial.
 * @param type - Type of the notable product.
 * @returns HTML code for the polynomial.
 */
function divSimplify() {
    var i;
    var exponent = Math.floor(Math.random()*(MAX_DEGREE/2)+1);
    var coeficient = Math.floor(Math.random()*(MAX_COEFICIENT/2)+1);
    this._battleSolution = [];
    for (i=0; i<MAX_DEGREE;i++) {
        this._battleSolution[i] = 0;
        if (i === exponent) {
            this._battleSolution[exponent] = coeficient;
        }
    }
    var maxElements=MAX_ELEMENTS; MAX_ELEMENTS = Math.floor(MAX_ELEMENTS/2);
    var polynomial1 = polynomialArray(); MAX_ELEMENTS = maxElements;
    var polynomial2 = [];
    for (i=0; i<MAX_DEGREE; i++) {
        for (j=0; j<MAX_DEGREE; j++) {
            if (polynomial2[i+j] === undefined) {
                polynomial2[i+j] = 0;
            }
            polynomial2[i+j] = polynomial2[i+j] + polynomial1[i]*this._battleSolution[j];
        }
    }
    return [polynomialHtml(polynomial2), polynomialHtml(polynomial1)];
}

function divProduct() {
    var maxElements = MAX_ELEMENTS;
    MAX_ELEMENTS = 2;
    // 1st polynomial
    var polynomials = [polynomialArray(), polynomialArray(), polynomialArray(), polynomialArray()];
    // Restore
    MAX_ELEMENTS = maxElements;
    // The solution
    solution = [[],[]];
    for (i=0; i<MAX_DEGREE; i++) {
        for (j=0; j<MAX_DEGREE; j++) {
            solution[0][i+j*MAX_DEGREE]=0;
            solution[1][i+j*MAX_DEGREE]=0;
        }
    }
    for (i=0; i<MAX_DEGREE; i++) {
        for (j=0; j<MAX_DEGREE; j++) {
            solution[0][i+j] = solution[0][i+j] + polynomials[0][i]*polynomials[2][j];
            solution[1][i+j] = solution[1][i+j] + polynomials[1][i]*polynomials[3][j];
        }
    }
    Crafty("Character")._battleSolution = solution;
    return [polynomialHtml(polynomials[0]),polynomialHtml(polynomials[1]),polynomialHtml(polynomials[2]),polynomialHtml(polynomials[3])];
}

function divCocient() {
    var maxElements = MAX_ELEMENTS;
    MAX_ELEMENTS = 2;
    // 1st polynomial
    var polynomials = [polynomialArray(), polynomialArray(), polynomialArray(), polynomialArray()];
    // Restore
    MAX_ELEMENTS = maxElements;
    // The solution
    solution = [[],[]];
    for (i=0; i<MAX_DEGREE; i++) {
        for (j=0; j<MAX_DEGREE; j++) {
            solution[0][i+j*MAX_DEGREE]=0;
            solution[1][i+j*MAX_DEGREE]=0;
        }
    }
    for (i=0; i<MAX_DEGREE; i++) {
        for (j=0; j<MAX_DEGREE; j++) {
            solution[0][i+j] = solution[0][i+j] + polynomials[0][i]*polynomials[3][j];
            solution[1][i+j] = solution[1][i+j] + polynomials[1][i]*polynomials[2][j];
        }
    }
    Crafty("Character")._battleSolution = solution;
    return [polynomialHtml(polynomials[0]),polynomialHtml(polynomials[1]),polynomialHtml(polynomials[2]),polynomialHtml(polynomials[3])];
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

function parseTerm(term) {
    var parsed = term.split("x");
    var coeficient = 0;
    var exponent = 0;
    if (parsed.length === 1) {
        // Term like "a"
        coeficient = parseInt(parsed[0],10);
        if (isNaN(coeficient)) {
            coeficient = 0;
        }
        exponent = 0;
    } else if (parsed.length === 2) {
        // Term like "ax^b"
        if (parsed[0] === "+") {
            coeficient = 1;
        } else if (parsed[0] === "-") {
            coeficient = -1;
        } else {
            coeficient = parseInt(parsed[0],10);
            if (isNaN(coeficient)) {
                coeficient = 0;
            }
        }
        if (parsed[1] === "") {
            // Term like "ax"
            exponent = 1;
        } else {
            // Term like "ax^b" with b>0
            exponent = parseInt(parsed[1].replace("^",""),10);
            if (isNaN(exponent)) {
                exponent = -1;
            }
        }
    }
    return [exponent, coeficient];
}

function parsePolynomial(textFieldInput) {
    var parsed = textFieldInput.replace(/[\+]/g,"%+").replace(/[\-]/g,"%-").split('%');
    var result = [];
    var term = [];
    for (var i=0; i<parsed.length; i++) {
        if (parsed[i] !== "+" || parsed[i] !== "-") {
            term = parseTerm(parsed[i]);
            result[term[0]] = term[1];
        }
    }
    return result;
}

function parseSolution(textFieldInput) {
    // First filter: We only allow: 0-9,x,+,-,(),^
    var parsed = textFieldInput.replace(/[\ -\'|\*|\,|\.-\/|\:-\]|\_-w|y-\~]/g, "");
    // Second filter: Brackets
    parsed = parsed.replace(/\(/g,"").split(")");
    solution = [];
    if (parsed.length === 1) {
        // No brackets, no notable
        solution = parsePolynomial(parsed[0]);
    } else {
        // Brackets: Notable
        if (parsed.length === 2 && parsed[1] === "^2") {
            // Square
            solution = parsePolynomial(parsed[0]);
        } else if (parsed.length === 3 && parsed[2] === "") {
            // Addition mult difference
            solution = parsePolynomial(parsed[1]);
        }
    }
    for (var i=0;i<MAX_DEGREE; i++){
        if (solution[i] === undefined) {
            solution[i] = 0;
        }
    }
    return solution;
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Registers the component
     */
    createComponent: function() {
        Crafty.c('Battle', {
            _battleFighting: false, // If we're currently in a fight.
            _battleOperation: undefined, // Operation: +,-,*,**,/
            _battleTimed: false, // If has a timeout
            _battleTimeout: undefined, // The timeout
            _battleTimer: undefined, // The setInterval variable
            _battleQuotient: [], //  The quotient if it's a quotient operation
            _battleSolution: [], // The battle solution
            _battleResult: undefined,
            /**
             * Adds two polynomials and returns the HTML to draw them
             * @returns HTML code array for the 2 polynomials.
             */
            addOperation: function() {
                var polynomials = [polynomialArray(),polynomialArray()];
                var solution = [];
                for (var i=0; i<MAX_DEGREE; i++) {
                    solution[i] = polynomials[0][i] + polynomials[1][i];
                }
                this._battleSolution = solution;
                return [polynomialHtml(polynomials[0]),polynomialHtml(polynomials[1])];
            },
            /**
             * Substracts two polynomials and returns the HTML to draw them
             * @returns HTML code array for the 2 polynomials.
             */
            subOperation: function() {
                var polynomials = [polynomialArray(),polynomialArray()];
                var solution = [];
                for (var i=0; i<MAX_DEGREE; i++) {
                    solution[i] = polynomials[0][i] - polynomials[1][i];
                }
                this._battleSolution = solution;
                return [polynomialHtml(polynomials[0]),polynomialHtml(polynomials[1])];
            },
            /**
             * Generates a notable product and its solution.
             * @param type - Type of the division
             */
            divOperation: function(type) {
                switch(type) {
                    case "simplify": return divSimplify();
                    case "product": return divProduct();
                    case "cocient": return divCocient();
                }
            },
            /**
             * Generates a notable product and its solution.
             * @param type - Type of the notable product.
             */
            notableOperation: function(type) {
                switch(type) {
                    case "expand": return notableCompressed();
                    case "compress": return notableUncompressed();
                }
            },
            /**
             * Generates a multiplication between polynomials and its solution
             * The HTML code.
             */
            mulOperation: function() {
                var polynomials = [];
                // 1st polynomial
                polynomials[0] = polynomialArray();
                // Change the length of the 2nd polynomial
                var maxElements = MAX_ELEMENTS;
                MAX_ELEMENTS = 2;
                polynomials[1] = polynomialArray();
                // Restore
                MAX_ELEMENTS = maxElements;
                // The solution
                for (i=0; i<MAX_DEGREE; i++) {
                    for (j=0; j<MAX_DEGREE; j++) {
                        this._battleSolution[i+j*MAX_DEGREE]=0;
                    }
                }
                for (i=0; i<MAX_DEGREE; i++) {
                    for (j=0; j<MAX_DEGREE; j++) {
                        this._battleSolution[i+j] = this._battleSolution[i+j] + polynomials[0][i]*polynomials[1][j];
                    }
                }
                return [polynomialHtml(polynomials[0]),polynomialHtml(polynomials[1])];
            },
            /**
             * Determines the battle operation depending on the enemy spotted. Stores
             * this operation in the entity.
             */
            whichOperation: function() {
                var enemy = this._detectionEnemy;
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
                if (this._clocks > 0) {
                    this._battleTimeout += BONUS_TIMEOUT;
                }
            },
            /**
             * Generates HTML code for the table with the two polynomials.
             * @param operationString - The operation.
             * @param htmlStrings - The strings with the polynomials.
             */
            createHtmlTable: function(operationString, htmlStrings) {
                var html = ['<div class="battle"><h1>Batalla</h1>',
                            '<div class="header">',
                            '<h2 class="left">Operación: <span style="color: #F00; line-height: 30px">' + operationString + "</span></h2>",
                            '<h2 class="right">Tiempo restante: <span id="time" class="big">' + this._battleTimeout + "</span></h2>",
                            '</div>',
                            '<table class="poly">'].join("\n");
                if (this._battleOperation === "/2" || this._battleOperation === "/3") {
                    html += ['<tr><td>' + htmlStrings[0] + '</td><td>' + htmlStrings[2] + '</td></tr>',
                            '<tr><td><hr/></td><td><hr/></td></tr>',
                             '<tr><td>' + htmlStrings[1] + '</td><td>' + htmlStrings[3] + '</td></tr></table>',
                             '<input id="solution1" class="solution" type="text" placeholder="Introduce el numerador del resultado"/>',
                             '<br/><input id="solution2" class="solution" type="text" placeholder="Introduce el denominador del resultado"/>',
                             '</div>'].join("\n");
                } else if (this._battleOperation === "**1" || this._battleOperation === "**2") {
                    html += ['<tr><td>' + htmlStrings + '</td></tr></table>',
                             '<input id="solution" class="solution" type="text" placeholder="Introduce la solución"/>',
                             '</div>'].join("\n");
                } else {
                    html += '<tr><td>' + htmlStrings[0] + '</td></tr>';
                    if (this._battleOperation === "/1") {
                        html+= '<tr><td><hr/></td></tr>';
                    }
                    html += ['<tr><td>' + htmlStrings[1] + '</td></tr></table>',
                             '<input id="solution" class="solution" type="text" placeholder="Introduce la solución"/>',
                             '</div>'].join("\n");
                }
                $("#cr-stage").append(html);
                $('#enemybar').css({"width": (this._detectionEnemy._enemyHealth*3) + "px"});
                $($(".lifebox").children()[2]).show();
                $($(".lifebox").children()[3]).show();
            },
            /**
             * Controls the time events
             */
            setTimeHandler: function() {
                // It's not the first battle, we have a result
                if (this._battleResult !== undefined) {
                    battleResultScreen = RESULT_SCREEN;
                    // Correct or wrong
                    if (this._battleResult) $(".battle").css({"background": CORRECT_SCREEN});
                    else $(".battle").css({"background": WRONG_SCREEN});
                }
                // The battle is timed so we set the text val in the html.
                if (this._battleTimed) {
                    var time = this._battleTimeout;
                    var battleResultScreen = 0;
                    $("#time").css({"text": "#FF0000"});
                } else {
                    $("#time").css({"text": "#00FF00"}).text("∞");
                }
                // Set the timer
                var before = new Date();
                this._battleTimer = setInterval( function() {
                    // Solves the "change tab" problem
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
             * Generates the polynomials and HTML and inserts it into the
             * game, controlling timing and all the events.
             */
            polynomialBattle: function() {
                this.whichOperation();
                var operationString;
                var htmlStrings;
                switch (this._battleOperation) {
                    case "*":
                        operationString = "MULTIPLICACIÓN";
                        htmlStrings = this.mulOperation();
                        break;
                    case "**":
                        p = 0.3;
                        if (Math.random() < 0.5) {
                            operationString = "EXPANDE EL PRODUCTO NOTABLE";
                            this._battleOperation = "**1";
                            htmlStrings = this.notableOperation("expand");
                        } else {
                            operationString = "CONVIERTE EN PRODUCTO NOTABLE";
                            this._battleOperation = "**2";
                            htmlStrings = this.notableOperation("compress");
                        }
                        break;
                    case "/":
                        var p = Math.random();
                        if (p < 0.33) {
                            operationString = "SIMPLIFICA";
                            this._battleOperation = "/1";
                            htmlStrings = this.divOperation("simplify");
                        } else if (p >= 0.33 && p < 0.66) {
                            operationString = "MULTIPLICA";
                            this._battleOperation = "/2";
                            htmlStrings = this.divOperation("product");
                        } else {
                            operationString = "DIVIDE";
                            this._battleOperation = "/3";
                            htmlStrings = this.divOperation("cocient");
                        }
                        break;
                    case "+":
                        operationString = "SUMA";
                        htmlStrings = this.addOperation();
                        break;
                    case "-":
                        operationString = "RESTA";
                        htmlStrings = this.subOperation();
                }
                this.createHtmlTable(operationString, htmlStrings);
                this.setTimeHandler();
            },
            /**
             * Creates a keyboard for introducing polynomials
             */
            polynomialKeyboard: function() {
                if (this._battleOperation === "/1" || this._battleOperation.charAt(0) !== "/") {
                    $("#solution").focus();
                    $('#solution').on("keydown",function(e) {
                        var key = e.keyCode || e.which;
                        // Enter
                        if (key === 13) {
                           if (this.value !== "") {
                                Crafty("Character").checkSolution(parseSolution(this.value));
                           }
                        }
                    });
                    $('#solution').on("keyup",function(e) {
                        var repl = this.value.replace(/[\!-\'|\*|\,|\.-\/|\:-\]|\_-w|y-\~]/g, "");
                        if (this.value != repl) {
                            this.value = repl;
                        }
                    });
                } else {
                    // Quotients
                    $("#solution1").focus();
                    $('#solution1').on("keydown",function(e) {
                        var key = e.keyCode || e.which;
                        // Enter
                        if (key === 13) {
                           if (this.value !== "") {
                                Crafty("Character").checkSolution(parseSolution(this.value),parseSolution($('#solution2').val()));
                           }
                        }
                    });
                    $('#solution2').on("keydown",function(e) {
                        var key = e.keyCode || e.which;
                        // Enter
                        if (key === 13) {
                           if (this.value !== "") {
                                Crafty("Character").checkSolution(parseSolution($('#solution1').val()), parseSolution(this.value));
                           }
                        }
                    });
                    $('#solution1').on("keyup",function(e) {
                        var repl = this.value.replace(/[\!-\'|\*|\,|\.-\/|\:-\]|\_-w|y-\~]/g, "");
                        if (this.value != repl) {
                            this.value = repl;
                        }
                    });
                    $('#solution2').on("keyup",function(e) {
                        var repl = this.value.replace(/[\!-\'|\*|\,|\.-\/|\:-\]|\_-w|y-\~]/g, "");
                        if (this.value != repl) {
                            this.value = repl;
                        }
                    });
                }
                
            },
            
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
            checkSolution: function(solution, solution2) {
                var correct = true;
                var correct1 = true, correct2 = true;
                var i=0;
                switch (this._battleOperation) {
                    case "/2":
                        for (i=0; i<this._battleSolution[0].length; i++) {
                            if ((solution[i] !== undefined) && (this._battleSolution[0][i] !== solution[i])) {
                                correct1 = false;
                                break;
                            }
                        }
                        for (i=0; i<this._battleSolution[1].length; i++) {
                            if ((solution2[i] !== undefined) && (this._battleSolution[1][i] !== solution2[i])) {
                                correct2 = false;
                                break;
                            }
                        }
                        correct = correct1 && correct2;
                        break;
                    case "/3":
                        for (i=0; i<this._battleSolution[0].length; i++) {
                            if ((solution[i] !== undefined) && (this._battleSolution[0][i] !== solution[i])) {
                                correct1 = false;
                                break;
                            }
                        }
                        for (i=0; i<this._battleSolution[1].length; i++) {
                            if ((solution2[i] !== undefined) && (this._battleSolution[1][i] !== solution2[i])) {
                                correct2 = false;
                                break;
                            }
                        }
                        correct = correct1 && correct2;
                        break;
                    case "*":
                        for (i=0; i<this._battleSolution.length; i++) {
                            if ((solution[i] !== undefined) && (this._battleSolution[i] !== solution[i])) {
                                correct = false;
                                break;
                            }
                        }
                        break;
                    default:
                        for (i=0; i<this._battleSolution.length; i++) {
                            if (this._battleSolution[i] !== solution[i]) {
                                correct = false;
                                break;
                            }
                        }
                        break;
                }
                this.clearBattle();
                if (correct) {
                    this._battleResult = true;
                    var endBattle = this._detectionEnemy.damage();
                    if (endBattle) {
                        Audio.stopAlert();
                        Audio.stopHidden();
                        Audio.playLevel();
                        if (this._clocks > 0) {
                            this._clocks--;
                            if (this._clocks === 0) {
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
                if (!TIMEOUT_SET) {
                    getTimeouts(function() {
                        TIMEOUT_SET = true;
                    });
                }
            }
        });
    }
};

});