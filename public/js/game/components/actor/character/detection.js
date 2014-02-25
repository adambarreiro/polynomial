// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/detection.js
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
    createComponent: function(editing) {
        Crafty.c('Detection', {
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
            init: function() {
                this.bind("EnterFrame", function () {
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
                });
            }
        });
    }
};

});