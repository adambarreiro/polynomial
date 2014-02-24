// -----------------------------------------------------------------------------
// Name: /public/js/game/editor/engine.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
define (["../constants", "./body", "../scenes" ,"require", "../menu"], function(Constants, Body, Scenes, Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
function polynomialArray(maxDegree, maxElements) {
    var maxCoeficient = 9;
    var signProbability = 0.5;
    var termProbability = 0.7;
    var polynomial = [];
    while (polynomial.length === 0) {
    var i=0;
        while (i < maxDegree) {
            if (polynomial.length >= maxElements) {
                break;
            }
            if (Math.random() <= termProbability) {
                polynomial[i] = Math.floor(Math.random()*(maxCoeficient)+1);
                if (Math.random() <= signProbability) {
                    polynomial[i] = -polynomial[i];
                }
            }
            i++;
        }
    }
    return polynomial;
}

function polynomialCocientArray(poly, maxElements) {
    var maxCoeficient = 9;
    var toMultiply = polynomialArray(maxCoeficient, maxElements);
    var result = [];
    // Starts in 1 to avoid constants
    delete Crafty("Char")._polinomios[1][0];
    for (var i=1; i<maxCoeficient; i++) {
        if (poly[i] !== undefined) {
            for (var j=1; j<maxCoeficient; j++) {
                if (toMultiply[j] !== undefined) {
                    if (result[i+j] === undefined) result[i+j] = 0;
                    result[i+j] = result[i+j] + poly[i]*toMultiply[j];
                }
            }
        }
    }
    Crafty("Char")._polinomios[5] = toMultiply;
    return result;
}

function polynomialNotableArray() {
    var maxCoeficient = 9;
    var notable = [];
    var index1 = 1, index2 = 1;
    while (index1 === index2) {
        index1 = Math.floor(Math.random()*(maxCoeficient)+1);
        index2 = Math.floor(Math.random()*(maxCoeficient)+1);
    }
    notable[index1] = Math.floor(Math.random()*(maxCoeficient)+1);
    notable[index2] = Math.floor(Math.random()*(maxCoeficient)+1);
    var p = Math.random();
    var result = [];
    var indexes = [];
    var j=0;
    if (p < 0.66) {
        for (var i=0; i<maxCoeficient; i++) {
            if (notable[i] !== undefined) {
                result[i*2] = notable[i] * notable[i];
                indexes[j] = i;
                j++;
            }
        }
        if (p < 0.33) {
            result[indexes[0] + indexes[1]] = 2*(notable[indexes[0]] * notable[indexes[1]]);
            Crafty("Char")._polinomios[3] = "+";
        } else {
            result[indexes[0] + indexes[1]] = -2*(notable[indexes[0]] * notable[indexes[1]]);
            Crafty("Char")._polinomios[3] = "-";
        }
    } else {
        var minDegree = 9999;
        for (var k=0; k<maxCoeficient; k++) {
            if (notable[k] !== undefined) {
                result[k*2] = notable[k] * notable[k];
                if (k < minDegree) minDegree = k;
            }
        }
        if (result[minDegree] > 0) result[minDegree] = -result[minDegree];
        Crafty("Char")._polinomios[3] = "*";
    }
    if (p >= 0.33 && p < 0.66) {
        if (index1 > index2) {
            if (notable[index2] > 0) notable[index2] = -notable[index2];
        } else {
            if (notable[index1] > 0) notable[index1] = -notable[index1];
        }
    } else {
        if (index1 > index2) {
            notable[index2] = Math.abs(notable[index2]);
        } else {
            notable[index1] = Math.abs(notable[index1]);
        }
    }
    Crafty("Char")._polinomios[2] = notable;
    return result;
}

function polynomialSolution() {
    var operation = whichOperation();
    var maxCoeficient = 9;
    var i, j;
    var poly1 = Crafty("Char")._polinomios[0];
    var poly2 = Crafty("Char")._polinomios[1];
    var input = Crafty("Char")._polinomios[4];
    var solution = [];
    var correct = true;
    switch(operation) {
        case "*":
            for (i=0; i<maxCoeficient; i++) {
                if (poly1[i] !== undefined) {
                    for (j=0; j<maxCoeficient; j++) {
                        if (poly2[j] !== undefined) {
                            if (solution[i+j] === undefined) solution[i+j] = 0;
                            solution[i+j] = solution[i+j] + poly1[i]*poly2[j];
                            correct = (solution[i+j] === input[i+j]);
                        }
                    }
                }
            }
            break;
        case "**":
            switch(Crafty("Char")._polinomios[5]) {
                case "+":
                    for (i=0; i<maxCoeficient; i++) {
                        if (poly1[i] === undefined) poly1[i] = 0;
                        if (poly2[i] === undefined) poly2[i] = 0;
                        if (input[i] === undefined) input[i] = 0;
                        solution[i] = poly1[i] + poly2[i];
                        correct = (solution[i] === input[i]);
                        if (!correct) break;
                    }
                    break;
                case "-":
                    for (i=0; i<maxCoeficient; i++) {
                        if (poly1[i] === undefined) poly1[i] = 0;
                        if (poly2[i] === undefined) poly2[i] = 0;
                        if (input[i] === undefined) input[i] = 0;
                        solution[i] = poly1[i] - poly2[i];
                        correct = (solution[i] === input[i]);
                        if (!correct) break;
                    }
                    break;
                default: break;
            }
            break;
        case "/":
            poly1 = Crafty("Char")._polinomios[5];
            for (i=0; i<maxCoeficient; i++) {
                if (poly1[i] !== undefined) {
                    correct = (poly1[i] === input[i]);
                }
            }
            break;
        case "+":
            for (i=0; i<maxCoeficient; i++) {
                if (poly1[i] === undefined) poly1[i] = 0;
                if (poly2[i] === undefined) poly2[i] = 0;
                if (input[i] === undefined) input[i] = 0;
                solution[i] = poly1[i] + poly2[i];
                correct = (solution[i] === input[i]);
                if (!correct) break;
                
            }
            break;
        case "-":
            for (i=0; i<maxCoeficient; i++) {
                if (poly1[i] === undefined) poly1[i] = 0;
                if (poly2[i] === undefined) poly2[i] = 0;
                if (input[i] === undefined) input[i] = 0;
                solution[i] = poly1[i] - poly2[i];
                correct = (solution[i] === input[i]);
                if (!correct) break;
                
            }
            break;
    }
    clearInterval(Crafty("Char")._battleTimer);
    $('body').unbind('keydown');
    $(".battle").remove();
    Crafty("Char").battle();
    if (correct) {
        if (Crafty("Char")._enemy.damage()) {
            Crafty('Char').startAll();
            Crafty('Enemy').each(function() {
                this.startAll();
            });
        }
    }
    else {
        Crafty("Char").damage("enemy");
    }
    
}


function polynomialBattle() {
    var operation = whichOperation();
    Crafty("Char")._polinomios[0] = polynomialArray(6);
    Crafty("Char")._polinomios[1] = [];
    Crafty("Char")._polinomios[2] = [];
    Crafty("Char")._polinomios[3] = [];
    Crafty("Char")._polinomios[4] = [];
    var operationString = "Operación: ";
    switch (operation) {
        case "*":
            operationString += "MULTIPLICACIÓN";
            Crafty("Char")._polinomios[1] = polynomialArray(9,3);
            break;
        case "**":
            if (Math.random() > 0.5) {
                operationString += "SUMA";
                Crafty("Char")._polinomios[5] = "+";
            }
            else {
                operationString += "RESTA";
                Crafty("Char")._polinomios[5] = "-";
            }
            Crafty("Char")._polinomios[1] = polynomialNotableArray();
            break;
        case "/":
            operationString += "DIVISIÓN";
            Crafty("Char")._polinomios[1] = Crafty("Char")._polinomios[0];
            Crafty("Char")._polinomios[0] = polynomialCocientArray(Crafty("Char")._polinomios[1], 2);
            break;
        case "+":
            operationString += "SUMA";
            Crafty("Char")._polinomios[1] = polynomialArray(9,6);
            break;
        case "-":
            operationString += "RESTA";
            Crafty("Char")._polinomios[1] = polynomialArray(9,6);
            break;
    }
    var html = ['<div class="battle">',
                            '<h1>Batalla</h1>',
                            '<h2 class="left">' + operationString + "</h2>",
                            '<h2 class="right">Tiempo restante:</h2>',
                            polynomialHtml(operation),
                            '<table class="solutionbox"><tr id="solution">',
                            '</tr></table>',
                            '<div id="time">' + Crafty("Char")._timeout +'</div>',
                            dibujarAyuda(),
                            '</div>'].join('\n');
    return html;
}


function buildPolynomial(polyArray) {
    var poly = [];
    var i = polyArray.length;
    while (i > 0) {
        i--;
        if (polyArray[i] !== undefined) {
            poly[i] = "";
            if (polyArray[i] > 0) {
                poly[i] = "+";
            }
            if (polyArray[i] !== 1 || polyArray[i] !== -1) {
                poly[i] = poly[i] + polyArray[i];
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

function buildNotable(type, poly) {
    var html = "(";
    var aux = [];
    var i;
    switch(type) {
        case "*":
            var espejo = "";
            for (i=poly.length; i>0; i--) {
                if (poly[i] !== undefined) {
                    if (poly[i] > 0) {
                        espejo+= "+";
                    }
                    if (poly[i] !== -1 && poly[i] !== 1)  espejo+= poly[i];
                    if (i > 0) {
                        espejo+= "x";
                        if (i > 1) {
                            espejo+="<sup>" + i + "</sup>&nbsp;";
                        } else {
                            espejo+="&nbsp;";
                        }
                    }
                    
                }
            }
            html+=espejo + ")(+" + espejo.replace("+","-").replace("+","-").substring(1,espejo.length)  + ")";
            break;
        default:
            for (i=poly.length; i>0; i--) {
                if (poly[i] !== undefined) {
                    if (poly[i] > 0) {
                        html+= "+";
                    }
                    if ((poly[i] !== -1) && (poly[i] !== 1)) html+= poly[i];
                    if (poly[i] === -1) html+= "-";
                    if (i > 0) {
                        html+= "x";
                        if (i > 1) {
                            html+="<sup>" + i + "</sup>&nbsp;";
                        } else {
                            html+="&nbsp;";
                        }
                    }
                }
            }
            html+=")<sup>2</sup>".replace(/\n/g, '');
        break;
    }
    return html;
}

function polynomialHtml(operation) {
    var polynomials = Crafty("Char")._polinomios;
    var html = "<table class='poly'><tr>";
    var i;
    var poly1 = buildPolynomial(polynomials[0]);
    var poly2;
    var length = poly1.length;
    switch (operation) {
        case "**":
            poly2 = buildNotable(polynomials[3], polynomials[2]);
            break;
        default:
            poly2 = buildPolynomial(polynomials[1]);
            if (length < poly2.length) length = poly2.length;
            break;
    }
    for (i=length;i>=0;i--) {
        if (poly1[i] !== undefined) {
            html += "<td>" + poly1[i] + "</td>";
        } else {
            html += "<td></td>";
        }
    }
    html += "</tr><tr>";
    switch (operation) {
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
}

function whichOperation() {
    if (Crafty("Char")._enemy.has("Enemy1")) {
        Crafty("Char")._timeout = 29.99;
        return "+";
    } else if (Crafty("Char")._enemy.has("Enemy2")) {
        Crafty("Char")._timeout = 39.99;
        return "-";
    }  else if (Crafty("Char")._enemy.has("Enemy2")) {
        Crafty("Char")._timeout = 99.99;
        return "*";
    }  else if (Crafty("Char")._enemy.has("Enemy2")) {
        Crafty("Char")._timeout = 99.99;
        return "**";
    }  else if (Crafty("Char")._enemy.has("Enemy2")) {
        Crafty("Char")._timeout = 99.99;
        return "/";
    } else return "";

}

function polynomialKeyboard() {
    var first = true;
    var full = false;
    var sign = false;
    var exponent = false;
    var cursor = -1;
    var solCoeficient, solExponent;
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
                        Crafty("Char")._polinomios[4][solExponent] = solCoeficient;
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
                Crafty("Char")._polinomios[4][solExponent] = solCoeficient;
                polynomialSolution();
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

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    createComponent: function(editing) {
        Crafty.c('Char', {
            _old_x: undefined,
            _timeout: 24.99,
            _operations: 5,
            _shield: 0,
            _enemy: undefined,
            _battleTimer: undefined,
            _polinomios: [],
            init: function(timed) {
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
            }
        });
    }
};

});