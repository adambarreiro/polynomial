// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/detection.js
// Author: Adam Barreiro
// Description: Detection component
// Updated: 02-02-2014
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
            _detectionRange: undefined,
            _detectionEnemy: undefined,
            _detectionSpotted: false,
            _detectionReachable: false,
            _detectionHidden: false,
            /**
             * Detection algorithm. Spots an enemy in a certain area, and detects
             * objects in between in order to cover the character.
             */
            detection: function() {
                // If the character is hidden
                if (this.hit("Hide")) {
                    this._detectionHidden = true;
                } else {
                    this._detectionHidden = false;
                }
                var obst_izq, obst_der;
                this._detectionRange = Crafty.map.search({_x: this.x-318, _y: this.y-1, _w: 636, _h: 32}, true);
                // Search for entities
                for (var i=0; i<this._detectionRange.length; i++) {
                    // Search for an enemy
                    if (this._detectionEnemy === undefined && this._detectionRange[i].has("Enemy")) {
                        this._detectionEnemy = this._detectionRange[i];
                    } else if (this._detectionRange[i].has("Terrain")) {
                        // There's an obstacle
                        if (obst_izq !== undefined) {
                            if ((this.x > this._detectionRange[i].x) && (this.x - obst_izq.x > this.x - this._detectionRange[i].x)) {
                                obst_izq = this._detectionRange[i];
                            }
                        } else {
                            if (this.x > this._detectionRange[i].x) {
                                obst_izq = this._detectionRange[i];
                            }
                        }
                        if (obst_der !== undefined) {
                            if ((this.x < this._detectionRange[i].x) && (obst_der.x - this.x > this._detectionRange[i].x - this.x)) {
                                obst_der = this._detectionRange[i];
                            }
                        } else {
                            if (this.x < this._detectionRange[i].x) {
                                obst_der = this._detectionRange[i];
                            }
                        }
                    }
                }
                // Enemy in the area
                if (this._detectionEnemy !== undefined) {
                    var covered = false;
                    var d;
                    if (this._detectionEnemy.getOrientation() === "left") {
                        // We're in front
                        if (this._detectionEnemy.x >= this.x) {
                            if (obst_der !== undefined) {
                                if (this._detectionEnemy.x > obst_der.x && this.x < obst_der.x) {
                                    covered = true;
                                    this._detectionReachable = false;
                                }
                            }
                            if (!covered) {
                                d = Math.abs(this.x - this._detectionEnemy.x);
                                if (d < 128.0 && !this._detectionHidden) {
                                    this._detectionSpotted = true;
                                } else {
                                    this._detectionSpotted = false;
                                    if (d < 128.0) this._detectionReachable = true;
                                    else this._detectionReachable = false;
                                }
                            }
                        } else {
                            // We're behind
                            d = Math.abs(this.x - this._detectionEnemy.x);
                            if (d < 128.0) this._detectionReachable = true;
                            else this._detectionReachable = false;
                            this._detectionSpotted = false;
                        }
                    }
                    else if (this._detectionEnemy.getOrientation() === "right") {
                        // We're in front
                        if (this._detectionEnemy.x <= this.x) {
                            if (obst_izq !== undefined) {
                                if (obst_izq.x > this._detectionEnemy.x && this.x > obst_izq.x) {
                                    covered = true;
                                    this._detectionReachable = false;
                                }
                            }
                            if (!covered) {
                                d = Math.abs(this.x - this._detectionEnemy.x);
                                if (d < 128.0 && !this._detectionHidden) {
                                    this._detectionSpotted = true;
                                } else {
                                    this._detectionSpotted = false;
                                    if (d < 128.0) this._detectionReachable = true;
                                    else this._detectionReachable = false;
                                }
                            }
                        } else {
                            // We're behind
                            d = Math.abs(this.x - this._detectionEnemy.x);
                            if (d < 128.0) this._detectionReachable = true;
                            else this._detectionReachable = false;
                            this._detectionSpotted = false;
                        }
                    }
                    if (this._detectionHidden) {
                        if (this._detectionReachable) {
                            $('#timeout').css({"color":"cyan",  "border-color" : "cyan"});
                            $('#timeout').html("¡ESTÁS ESCONDIDO Y PUEDES ATACAR!");
                        } else {
                            $('#timeout').css({"color":"#33FF33", "border-color" : "#33FF33"});
                            $('#timeout').html("¡ESTÁS ESCONDIDO! ESPERA PARA ATACAR...");
                        }
                    } else {
                        if (covered) {
                            $('#timeout').css({"color":"white",  "border-color" : "white"});
                            $('#timeout').html("SIN PELIGRO");
                        } else {
                            if (this._detectionSpotted) {
                                $('#timeout').css({"color":"red",  "border-color" : "red"});
                                $('#timeout').html("ALERTA MÁXIMA, ¡TE HAN PILLADO!");
                            } else {
                                $('#timeout').css({"color":"yellow", "border-color" : "yellow"});
                                if (this._detectionReachable) {
                                    $('#timeout').html("¡¡ENEMIGO MUY CERCA, ATACA O ESCÓNDETE!!");
                                } else {
                                    $('#timeout').html("¡CUIDADO, ENEMIGO A LA VISTA!");
                                }
                            }
                        }
                    }
                } else {
                    if (!this._detectionHidden) {
                        $('#timeout').css({"color":"white", "border-color" : "white"});
                        $('#timeout').html("SIN PELIGRO");
                    } else {
                        $('#timeout').css({"color":"#33FF33", "border-color" : "#33FF33"});
                        $('#timeout').html("¡ESTÁS ESCONDIDO! ESPERA PARA ATACAR...");
                    }
                }
                if (this._detectionSpotted) {
                    this._detectionSpotted = false;
                    this.battle(true);
                }
            },
            /**
             * Returns the enemy that triggers a battle
             */
            getEnemy: function() {
                return this._detectionEnemy;
            },
            /**
             * Inits the component
             */
            init: function() {
                this.requires("Battle");
                this.bind("KeyDown", function () {
                    if (this.isDown("A")) {
                        if (this._detectionReachable) {
                            if (!this._detectionHidden) {
                                this.battle(true);
                            } else {
                                this.battle(false);
                            }
                        }
                    }
                });
                this.bind("EnterFrame", function () {
                    this.detection();
                });
            }
        });
    }
};

});