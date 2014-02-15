// -----------------------------------------------------------------------------
// Name: /public/js/menu/register.js
// Author: Adam Barreiro Costa
// Description: Main module for the register screen that unites view and controller.
// Updated: 23-10-2013
// -----------------------------------------------------------------------------

/**
 * Register main file - RequireJS
 * @dependency /public/js/menu/view.js
 * @dependency /public/js/menu/controller.js
 */
require(['./view','./controller'], function(View, Controller) {
    Controller.csrfAjax();
    // Gets URL parameters.
    Controller.getParameters();
    // Gets all the groups to fullfill the dropdown list.
    Controller.ajaxGetGroups(function(data) {
        View.setGroupList(data);
    });
    content = $('.content');
    // Draws the admin panel.
    content.append(View.registerGetPanel());
    // Sets all the handlers.
    Controller.registerSetHandlers(content);
    Controller.registerIndicationsPopup(content);
});