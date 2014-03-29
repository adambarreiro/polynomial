// -----------------------------------------------------------------------------
// Name: main.js
// Author: Adam Barreiro
// Description: Executes the editor
// -----------------------------------------------------------------------------

/**
 * Main file - RequireJS
 */
require(['./menu','./engine', '../components'], function(Menu, Engine, Components) {
    var pri = document.cookie.indexOf("token=")+"token=".length;
    var fin = document.cookie.indexOf(";", pri);
    if (fin < 0) {
        fin = document.cookie.length;
    }
    jQuery.ajaxPrefilter(function(options, _, xhr) {
        if (!xhr.crossDomain)
            xhr.setRequestHeader('X-CSRF-Token', document.cookie.substring(pri,fin));
    });
    $(document).ready(function() {
        $('input[type!="button"][type!="submit"], select, textarea').val('').blur();
    });
    Components.loadEditorGraphics(function() {
        Engine.init();
        Menu.init();
    });
});