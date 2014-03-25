// -----------------------------------------------------------------------------
// Name: /public/js/game/components/patrol.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------


define (function() {

var PATROL_PROBABILITY = 0.5; // Balanced

/**
 * Gives a random direction to patrol
 */
function randOrientation() {
    if (Math.random() < PATROL_PROBABILITY) {
        return "right";
    } else {
        return "left";
    }
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Registers the component into the game.
     */
    registerComponent: function(edition) {
        Crafty.c('Patrol', {
            _patrolSpeed: 1,
            _patrolWall: undefined,
            _patrolFloor: undefined,
            /**
             * Function to patrol in left direction.
             */
            goRight: function() {
                this._patrolWall = Crafty.map.search({_x: this.x+32, _y: this.y, _w: 1, _h: 1}, true);
                if (this._patrolWall.length > 0) {
                    if (this._patrolWall[0].has("Terrain")) {
                        this._patrolOrientation = "left";
                    } else {
                        this.x += this._patrolSpeed;
                    }
                }
                else {
                    this._patrolFloor = Crafty.map.search({_x: this.x+32, _y: this.y+32, _w: 1, _h: 1}, true);
                    if (this._patrolFloor.length === 0) {
                        this._patrolOrientation = "left";
                    } else {
                        if (!this._patrolFloor[0].has("Actor")) {
                            this.x += this._patrolSpeed;
                        } else {
                            this._patrolOrientation = "left";
                        }
                    }
                }
            },
            /**
             * Function to patrol in left direction.
             */
            goLeft: function() {
                this._patrolWall = Crafty.map.search({_x: this.x-1, _y: this.y, _w: 1, _h: 1}, true);
                if (this._patrolWall.length > 0) {
                    if (this._patrolWall[0].has("Terrain")) {
                        this._patrolOrientation = "right";
                    } else {
                        this.x -= this._patrolSpeed;
                    }
                }
                else {
                    this._patrolFloor = Crafty.map.search({_x: this.x-1, _y: this.y+32, _w: 1, _h: 1}, true);
                    if (this._patrolFloor.length === 0) {
                        this._patrolOrientation = "right";
                    } else {
                        if (!this._patrolFloor[0].has("Actor")) {
                            this.x -= this._patrolSpeed;
                        } else {
                            this._patrolOrientation = "right";
                        }
                    }
                }
            },
            getOrientation: function() {
                return this._patrolOrientation;
            },
            /**
             * Starts the component
             */
            startPatrol: function() {
                this._patrolOrientation = randOrientation(); // Local for each enemy
                this.bind("EnterFrame", function(e) {
                    if (this._patrolOrientation === "right") {
                        if (!this.isPlaying("EnemyAnimationRight")) {
                            this.animate("EnemyAnimationRight",-1);
                        }
                        this.goRight();
                    } else if (this._patrolOrientation === "left") {
                        if (!this.isPlaying("EnemyAnimationLeft")) {
                            this.animate("EnemyAnimationLeft",-1);
                        }
                        this.goLeft();
                    }
                });
            },
            /**
             * Inits the component.
             */
            init: function() {
                this.requires('Enemy');
                if (!edition) {
                    this.startPatrol();
                }
            }
        });
    },

};

});