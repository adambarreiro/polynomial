// -----------------------------------------------------------------------------
// Name: /public/js/game/constants.js
// Author: Adam Barreiro
// Description: Gives some constants
// -----------------------------------------------------------------------------
define(function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

// The size of a single tile in pixels
var TILE_SIZE = {
    width: 32, // pixels
    height: 32 // pixels
};

// The size of the viewport (the screen that we're watching) in pixels
var VIEWPORT_SIZE = {
    width: 0, // pixels
    height: 0 // pixels
};

// The size of the entire level in pixels
var LEVEL_SIZE = {
    width: 5376,
    height: 3200
};

function updateViewportSize() {
    VIEWPORT_SIZE.width = window.innerWidth-200;
    VIEWPORT_SIZE.height = window.innerHeight-200;
    w_ok = false;
    h_ok = false;
    while (!w_ok && !h_ok) {
        if (!w_ok) {
            VIEWPORT_SIZE.width--;
            w_ok = (VIEWPORT_SIZE.width % 32 === 0);
        }
        if (!h_ok) {
            VIEWPORT_SIZE.height--;
            h_ok = (VIEWPORT_SIZE.height % 32 === 0);
        }
    }
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    getTileSize: function(units) {
        switch(units) {
            case 'tiles':
                var pxSize = {
                    width: 1,
                    height: 1
                };
                return pxSize;
            case 'px':
                return TILE_SIZE;
        }
    },

    getViewportSize: function(units) {
        updateViewportSize();
        switch(units) {
            case 'tiles':
                var pxSize = {
                    width: Math.floor(VIEWPORT_SIZE.width/TILE_SIZE.width),
                    height: Math.floor(VIEWPORT_SIZE.height/TILE_SIZE.width)
                };
                return pxSize;
            case 'px':
                return VIEWPORT_SIZE;
        }
    },
    getLevelSize: function(units) {
        switch(units) {
            case 'tiles':
                var pxSize = {
                    width: Math.floor(LEVEL_SIZE.width/TILE_SIZE.width),
                    height: Math.floor(LEVEL_SIZE.height/TILE_SIZE.width)
                };
                return pxSize;
            case 'px':
                return LEVEL_SIZE;
        }
    }
};
});
