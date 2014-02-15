// -----------------------------------------------------------------------------
// Name: /public/js/menu/login.js
// Author: Adam Barreiro Costa
// Description: Main module for the login screen that unites view and controller.
// Updated: 23-10-2013
// -----------------------------------------------------------------------------

/**
 * Login main file - RequireJS
 * @dependency /public/js/menu/view.js
 * @dependency /public/js/menu/controller.js
 */
require(['./view','./controller'], function(View, Controller) {
    Controller.csrfAjax();
    // Gets URL parameters.
    Controller.getParameters();
    content = $('.content');
    // Draws the admin panel.
    content.append(View.loginGetPanel());
    // Sets all the handlers.
    Controller.loginSetHandlers(content);
});