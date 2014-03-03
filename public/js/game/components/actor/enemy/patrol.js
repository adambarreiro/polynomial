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
            patrolSpeed: 1,
            _patrolOrientationStart: true,
            _patrolOrientation: "left",
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
                        this.x += this.patrolSpeed;
                    }
                }
                else {
                    this._patrolFloor = Crafty.map.search({_x: this.x+32, _y: this.y+32, _w: 1, _h: 1}, true);
                    if (this._patrolFloor.length === 0) {
                        this._patrolOrientation = "left";
                    } else {
                        this.x += this.patrolSpeed;
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
                        this.x -= this.patrolSpeed;
                    }
                }
                else {
                    this._patrolFloor = Crafty.map.search({_x: this.x-32, _y: this.y+32, _w: 1, _h: 1}, true);
                    if (this._patrolFloor.length === 0) {
                        this._patrolOrientation = "right";
                    } else {
                        this.x -= this.patrolSpeed;
                    }
                }
            },
            /**
             * Starts the component
             */
            startPatrol: function() {
                if (this._patrolOrientationStart) {
                    // Only enters here when the entity is created in order
                    // to give a random orientation only at start and then
                    // resume it when all events are stopped.
                    this._patrolOrientation = randOrientation();
                    this._patrolOrientationStart = false;
                }
                this.bind("EnterFrame", function(e) {
                    if (this._patrolOrientation === "right") {
                        this.goRight();
                    } else if (this._patrolOrientation === "left") {
                        this.goLeft();
                    }
                });
            },
            /**
             * Returns the patrol orientation
             */
            getOrientation: function() {
                return this._patrolOrientation;
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