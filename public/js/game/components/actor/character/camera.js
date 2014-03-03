// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/camera.js
// Author: Adam Barreiro
// Description: 
// Updated: 01-03-2014
// -----------------------------------------------------------------------------

/**
 * camera.js
 * @dependency /public/js/game/constants.js
 */
define (["../../../constants"], function(Constants) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Creates the component.
     */
    createComponent: function() {
        Crafty.c('Camera', {
            _cameraOldX: undefined,
            /**
             * Vertical scroll controller
             */
            verticalScroll: function() {
                if (this.y > Constants.getViewportSize('px').height / 2)
                    Crafty.viewport.scroll('_y', -(this.y + (this.h / 2) - (Constants.getViewportSize('px').height / 2)));
            },
            /**
             * Horizontal scroll controller
             */
            horizontalScroll: function(from) {
                var size = Constants.getViewportSize('px');
                if (this._cameraOldX !== this.x && (Math.abs(this.x - from.x) > 1)) {
                    this._cameraOldX = this.x;
                    if (this.x > size.width/2) {
                        Crafty.viewport.x -= this.x - from.x;
                    }
                }
                if(this.hit('Terrain')){
                    this.attr({x: from.x, y:from.y});
                }
            },
            /**
             * Limits the stage creating invisible bounds.
             */
            bounds: function(from) {
                if (this.x <= 0 || this.x >= Constants.getLevelSize('px').width) {
                    this.x = from.x;
                }
            },
            /**
             * Inits component
             */
            init: function() {
                this.requires("Character");
                this.bind("EnterFrame", function () {
                    this.verticalScroll();
                });
                this.bind('Moved', function(from) {
                    this.horizontalScroll(from);
                    this.bounds(from);
                });
            }
        });
    }
};

});