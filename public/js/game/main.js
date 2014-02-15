// -----------------------------------------------------------------------------
// Name: /public/js/game/main.js
// Author: Adam Barreiro Costa
// Description: Main module for the game screen that unites view and controller.
// Updated: 26-12-2013
// -----------------------------------------------------------------------------

/**
 * Game main file - RequireJS
 * @dependency /public/js/menu/view.js
 * @dependency /public/js/menu/controller.js
 */
require(['./constants', './menu', './components'], function(Constants, Menu, Components) {
    var pri = document.cookie.indexOf("token=")+"token=".length;
    var fin = document.cookie.indexOf(";", pri);
    if (fin < 0) {
        fin = document.cookie.length;
    }
    jQuery.ajaxPrefilter(function(options, _, xhr) {
        if (!xhr.crossDomain)
            xhr.setRequestHeader('X-CSRF-Token', document.cookie.substring(pri,fin));
    });
    content = $('.container');
    // Draws the game selector panel.
    content.append(Menu.getGamePanel());
    // Sets all the handlers.
    Components.setEditor(false);
    Components.init();
    Menu.menuHandler();
});