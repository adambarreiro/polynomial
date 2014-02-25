// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/bonus.js
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
    registerComponent: function(edition) {
        Crafty.c('Camera', {
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
            verticalScroll: function() {
                this.bind("EnterFrame", function () {
                    if (this.y > Constants.getViewportSize('px').height / 2)
                        Crafty.viewport.scroll('_y', -(this.y + (this.h / 2) - (Constants.getViewportSize('px').height / 2)));
                });
            },
            horizontalScroll: function(from) {
                this.bind('Moved', function(from) {
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
                });
            },
            bounds: function(from) {
                this.bind('Moved', function(from) {
                    if (this.x <= 0 || this.x >= Constants.getLevelSize('px').width) {
                        this.x = from.x;
                    }
                });
            },
        });
    }
};

});