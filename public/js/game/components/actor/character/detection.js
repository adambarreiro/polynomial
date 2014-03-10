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
            _detectionEnemy: undefined,
            _detectionSpotted: false,
            _detectionReachable: false,
            _detectionHidden: false,
            /**
             * Detection algorithm. Spots an enemy in a certain area, and detects
             * objects in between in order to cover the character.
             */
            detection: function() {
                var detectionRange = Crafty.map.search({_x: this.x-320, _y: this.y, _w: 640, _h: 32}, true);
                // If the character is hidden
                if (this.hit("Hide")) {
                    this._detectionHidden = true;
                } else {
                    this._detectionHidden = false;
                }
                var obst_izq, obst_der;
                // Search for entities
                for (var i=0; i<detectionRange.length; i++) {
                    // Search for an enemy
                    if (detectionRange[i].has("Enemy")) {
                        // New enemy spotted
                        if (this._detectionEnemy === undefined) {
                            this._detectionEnemy = detectionRange[i];
                        } else {
                            // Another enemy, check if it's nearer
                            if (Math.abs(this.x - detectionRange[i].x) < Math.abs(this.x - this._detectionEnemy.x)) {
                                this._detectionEnemy = detectionRange[i];
                            }
                        }
                    }
                    if (detectionRange[i].has("Terrain")) {
                        // We didn't detect an obstacle at left yet
                        if (obst_izq === undefined) {
                            // If the obstacle is at left, save it.
                            if (this.x > detectionRange[i].x) {
                                obst_izq = detectionRange[i];
                            }
                        } else {
                            // We have an obstacle stored. Check if it's at left and if it's nearer
                            // from the character than the saved. If yes, update.
                            if ((this.x > detectionRange[i].x) && (Math.abs(this.x - detectionRange[i].x) < Math.abs(this.x - obst_izq.x))) {
                                obst_izq = detectionRange[i];
                            }
                        }
                        // We didn't detect an obstacle at right yet
                        if (obst_der === undefined) {
                            // If the obstacle is at right, save it.
                            if (this.x < detectionRange[i].x) {
                                obst_der = detectionRange[i];
                            }
                        } else {
                            // We have an obstacle stored. Check if it's at right and if it's nearer
                            // from the character than the saved. If yes, update.
                            if ((this.x < detectionRange[i].x) && (Math.abs(this.x - detectionRange[i].x) < Math.abs(this.x - obst_der.x))) {
                                obst_der = detectionRange[i];
                            }
                        }
                    }
                }
                // Enemy in the area
                if (this._detectionEnemy !== undefined) {
                    var covered = false;
                    var d;
                    // Check if there's an obstacle at right
                    if (obst_der !== undefined) {
                        // There's an obstacle. Check if it's between the enemy and us.
                        if (this.x < obst_der.x && obst_der.x < this._detectionEnemy.x) {
                            covered = true;
                            this._detectionReachable = false;
                        }
                    }
                    // Check if there's an obstacle at left
                    if (obst_izq !== undefined) {
                        // There's an obstacle. Check if it's between the enemy and us.
                        if (this.x > obst_izq.x && obst_izq.x > this._detectionEnemy.x) {
                            covered = true;
                            this._detectionReachable = false;
                        }
                    }
                    // Left orientation
                    if (!covered) {
                        if (this._detectionEnemy.getOrientation() === "left") {
                            if (this.x < this._detectionEnemy.x) {
                                // We can be spotted
                                d = Math.abs(this.x - this._detectionEnemy.x);
                                // Check distance and if we're hidden
                                if (d < 128.0 && !this._detectionHidden) {
                                    this._detectionSpotted = true;
                                } else {
                                    this._detectionSpotted = false;
                                    if (d < 128.0) this._detectionReachable = true;
                                    else this._detectionReachable = false;
                                }
                            } else {
                                // We're behind
                                d = Math.abs(this.x - this._detectionEnemy.x);
                                if (d < 128.0) this._detectionReachable = true;
                                else this._detectionReachable = false;
                                this._detectionSpotted = false;
                            }
                        }
                        else {
                            // Right orientation
                            if (this._detectionEnemy.x <= this.x) {
                                // We can be spotted
                                d = Math.abs(this.x - this._detectionEnemy.x);
                                // Check distance and if we're hidden
                                if (d < 128.0 && !this._detectionHidden) {
                                    this._detectionSpotted = true;
                                } else {
                                    this._detectionSpotted = false;
                                    if (d < 128.0) this._detectionReachable = true;
                                    else this._detectionReachable = false;
                                }
                            } else {
                                // We're behind
                                d = Math.abs(this.x - this._detectionEnemy.x);
                                if (d < 128.0) this._detectionReachable = true;
                                else this._detectionReachable = false;
                                this._detectionSpotted = false;
                            }
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
                    Crafty.audio.stop("level");
                    Crafty.audio.play("alert",-1);
                    this.battle(true);
                } else {
                    if (!this._detectionHidden) {
                        this._detectionEnemy = undefined;
                    }
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
                            Crafty.audio.stop("level");
                            if (!this._detectionHidden) {
                                Crafty.audio.play("alert",-1);
                                this.battle(true);
                            } else {
                                Crafty.audio.play("hidden",-1);
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