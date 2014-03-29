// -----------------------------------------------------------------------------
// Name: /public/js/game/components/actor/character/camera.js
// Author: Adam Barreiro
// Description: Manages the camera.
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
                Crafty.viewport.scroll('_y', -(this.y + (this.h / 2) - (Constants.getViewportSize('px').height / 2)));
            },
            /**
             * Horizontal scroll controller
             */
            horizontalScroll: function(from) {
                Crafty.viewport.scroll('_x', -(this.x + (this.w / 2) - (Crafty.viewport.width / 2)));
            },
            /**
             * Inits component
             */
            init: function() {
                this.requires("Character");
                /*this.bind("EnterFrame", function () {
                    this.verticalScroll();
                    Crafty.viewport._clamp();
                });
                this.bind('Moved', function(from) {
                    this.horizontalScroll(from);
                });*/
            }
        });
    }
};

});