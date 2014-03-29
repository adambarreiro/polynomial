// -----------------------------------------------------------------------------
// Name: /public/js/menu/admin.js
// Author: Adam Barreiro Costa
// Description: Main module for the admin screen that unites view and controller.
// -----------------------------------------------------------------------------

/**
 * Admin main file - RequireJS
 * @dependency /public/js/menu/view.js
 * @dependency /public/js/menu/controller.js
 */
require(['./view','./controller'], function(View, Controller) {
    Controller.csrfAjax();
    // Gets URL parameters.
    Controller.getParameters();
    content = $('.content');
    // Shows an indicator if there are students with no group.
    Controller.ajaxGetStudents(false, function(data) {
        if (data.length > 0)
        $('body').append(View.adminShowUnassignedStudents(data.length));
    });
    // Draws the admin panel.
    content.append(View.adminGetPanel());
    // Sets all the handlers.
    Controller.adminSetHandlers(content);
});