// -----------------------------------------------------------------------------
// Name: /public/js/menu/view.js
// Author: Adam Barreiro Costa
// Description: Module with all the functions needed to draw elements on the
// screen.
// -----------------------------------------------------------------------------

define (function() {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var FIELD_LIMITS = {
    MIN: 6, // Used for passwords, for example.
    MAX: 50
};

function csrf() {
    var pri = document.cookie.indexOf("token=")+"token=".length;
    var fin = document.cookie.indexOf(";", pri);
    if (fin < 0) {
        fin = document.cookie.length;
    }
    return '<input type="hidden" value="' + document.cookie.substring(pri,fin) + '" name="_csrf" />';
}


// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {

    /**
     * HTML of the login panel.
     * @return String - HTML code of the login panel
     */
    loginGetPanel: function() {
        return ['<form method="POST" class="menu" action="signin">',
                    csrf(),
                    '<input class="field" type="text" name="email" placeholder="Correo electr&oacute;nico"/>',
                    '<input class="field" type="password" name="password" placeholder="Contrase&ntilde;a"/>',
                    '<input class="button" type="submit" value="Entrar"/>',
                    '<input class="button" type="button" value="Registrar"/>',
                '</form>'].join('\n');
    },

    /**
     * HTML of the register panel
     * @return String - HTML code of the register panel
     */
    registerGetPanel: function() {
        return ['<form method="POST" class="menu" action="signup">',
                    csrf(),
                    '<div class="separator">Tu cuenta</div>',
                    '<input class="field" type="text" name="email" placeholder="Correo electr&oacute;nico"/>',
                    '<input class="field" type="password" name="password" placeholder="Contrase&ntilde;a"/>',
                    '<input class="field" type="password" name="password2" placeholder="Repetir contrase&ntilde;a"/>',
                    '<div class="separator">Tus datos personales</div>',
                    '<input class="field" type="text" name="name" placeholder="Nombre"/>',
                    '<input class="field" type="text" name="surname1" placeholder="Primer apellido"/>',
                    '<input class="field" type="text" name="surname2" placeholder="Segundo apellido"/>',
                    '</select>',
                    '<input class="button" type="submit" value="Registrar"/>',
                    '<input class="button" type="button" value="Atr&aacute;s"/>',
                '</form>',
                '<div id="bottomline">Tu profesor ver&aacute; y confirmar&aacute; tus datos.</div>'].join('\n');
    },

    /**
     * Draws a popup with information of the field.
     * @param field - The field which must show the info.
     * @param type - The type of field.
     */
    registerPopupsOn: function(field, type) {
        if (type === 'email')
            help = "Introduce un e-mail v&aacute;lido.";
        else if (type === 'password')
            help = this.getFieldLimitsMin() + " caracteres como m&iacute;nimo." +
                "<br/> Intenta que sea complicada.";
        else if (type === 'password2')
            help = "Repite la contrase&ntilde;a anterior.";
        else if (type === 'name')
            help = "Tu nombre de pila.";
        else if (type === 'surname1')
            help = "Tu primer apellido.";
        else if (type === 'surname2')
            help = "Tu segundo apellido.<br/>Puedes dejarlo en blanco si no tienes.";
        $('<div class="popup">' + help + '</div>').insertBefore(field);
    },

    /**
     * Erases the popup with information of the field.
     */
    registerPopupsOff: function() {
        $(".popup").remove();
    },

    /**
     * HTML of the admin panel.
     * @return String - HTML code of the admin panel.
     */
    adminGetPanel: function() {
        return ['<div class="menu">',
                    '<div class="separator">Grupos</div>',
                    '<div class="buttonext" id="createGroup">Crear grupo</div>',
                    '<div class="buttonext" id="editGroup">Editar grupo</div>',
                    '<div class="buttonext" id="deleteGroup">Eliminar grupo</div>',
                    '<div class="separator">Grupos y alumnos</div>',
                    '<div class="buttonext" id="assignGroup">Asignar a grupo</div>',
                    '<div class="buttonext" id="disposeGroup">Quitar de grupo</div>',
                    '<div class="separator">Alumnos</div>',
                    '<div class="buttonext" id="viewStudent">Ver alumno</div>',
                    '<div class="buttonext" id="deleteStudent">Eliminar alumno</div>',
                    '<div class="separator">Administradores</div>',
                    '<div class="buttonext" id="editAdmin">Editar administrador</div>',
                    '</div>',
                '<div class="extra">',
                    '<form method="GET" action="signout">',
                        csrf(),
                        '<input id="lobutton" type="submit" value="Salir"/>',
                    '</form>',
                    '<div id="edbutton">Editor de niveles</div>',
                '</div>'].join('\n');
    },
    /**
     * HTML of the group creation submenu.
     * @return String - HTML code of the createGroup option menu.
     */
    adminCreateGroup: function() {
        return ['<form method="POST" class="menu" action="createGroup">',
                    csrf(),
                    '<div class="separator">Crear un grupo nuevo</div>',
                    '<input class="field" type="text" name="name" placeholder="Nombre del grupo"/>',
                    '<input class="button" type="submit" value="Crear grupo"/>',
                    '<input class="button" type="button" value="Atr&aacute;s"/>',
                '</form>'].join('\n');
    },
    /**
     * HTML of the group edition submenu.
     * @return String - HTML code of the editGroup option menu.
     */
    adminEditGroup: function() {
        return ['<form method="POST" class="menu" action="editGroup">',
                    csrf(),
                    '<div class="separator">Editar un grupo existente</div>',
                    '<select class="field" name="original" id="group"><option value=" ">Selecciona el grupo</option></select>',
                    '<input class="field" type="text" name="name" placeholder="Nombre del grupo"/>',
                    '<input class="button" type="submit" value="Editar grupo"/>',
                    '<input class="button" type="button" value="Atr&aacute;s"/>',
                '</form>'].join('\n');
    },
    /**
     * HTML of the group removal submenu.
     * @return String - HTML code of the deleteGroup option menu.
     */
    adminDeleteGroup: function() {
        return ['<form method="POST" class="menu" action="deleteGroup">',
                    csrf(),
                    '<div class="separator">Eliminar un grupo existente</div>',
                    '<select class="field" name="name" id="group"><option value=" ">Selecciona el grupo</option></select>',
                    '<input class="button" type="submit" value="Eliminar grupo"/>',
                    '<input class="button" type="button" value="Atr&aacute;s"/>',
                '</form>'].join('\n');
    },
    /**
     * HTML of the group assignment submenu.
     * @return String - HTML code of the assignGroup option menu.
     */
    adminAssignGroup: function() {
        return ['<form method="POST" class="menu" action="assignGroup">',
                    csrf(),
                    '<div class="separator">Asignar un grupo a un alumno</div>',
                    '<select class="field" name="name" id="student"><option value=" ">Selecciona el alumno</option></select>',
                    '<select class="field" name="group" id="group"><option value=" ">Selecciona el grupo</option></select>',
                    '<input class="button" type="submit" value="Asignar grupo"/>',
                    '<input class="button" type="button" value="Atr&aacute;s"/>',
                '</form>'].join('\n');
    },
    /**
     * HTML of the group disposal submenu.
     * @return String - HTML code of the disposeGroup option menu
     */
    adminDisposeGroup: function() {
        return ['<form method="POST" class="menu" action="disposeGroup">',
                    csrf(),
                    '<div class="separator">Quitar a un alumno del grupo</div>',
                    '<select class="field" name="name" id="student"><option value=" ">Selecciona el alumno</option></select>',
                    '<input class="button" type="submit" value="Quitar de su grupo"/>',
                    '<input class="button" type="button" value="Atr&aacute;s"/>',
                '</form>'].join('\n');
    },
    /**
     * HTML of the student view submenu.
     * @return String - HTML code of the viewStudent option menu.
     */
    adminViewStudent: function() {
        return ['<form class="menu">',
                    csrf(),
                    '<div class="separator">Ver los datos de un alumno</div>',
                    '<select class="field" name="name" id="student"><option value=" ">Selecciona el alumno</option></select>',
                    '<div class="separator">Datos personales</div>',
                    '<input class="field" type="text" name="name" placeholder="Nombre" disabled/>',
                    '<input class="field" type="text" name="surname1" placeholder="Primer apellido" disabled/>',
                    '<input class="field" type="text" name="surname2" placeholder="Segundo apellido" disabled/>',
                    '<input class="field" type="text" name="group" placeholder="Grupo" disabled/>',
                    '<div class="separator">Progreso en el juego</div>',
                    '<input class="field" type="text" name="level" placeholder="Nivel actual" disabled/>',
                    '<select class="field" type="text" name="stats"><option value="">Estadísticas</option></select>',
                    '<input class="button" type="button" value="Atr&aacute;s"/>',
                '</form>'].join('\n');
    },
    /**
     * HTML of the student removal submenu.
     * @return String - HTML code of the deleteStudent option menu.
     */
    adminDeleteStudent: function() {
        return ['<form method="POST" class="menu" action="deleteStudent">',
                    csrf(),
                    '<div class="separator">Eliminar un alumno</div>',
                    '<select class="field" name="name" id="student"><option value=" ">Selecciona el alumno</option></select>',
                    '<input class="button" type="submit" value="Eliminar alumno"/>',
                    '<input class="button" type="button" value="Atr&aacute;s"/>',
                '</form>'].join('\n');
    },
    /**
     * HTML of the admin edition submenu.
     * @return String - HTML code of the editAdmin option menu.
     */
    adminEditAdmin: function() {
        return ['<form method="POST" class="menu" action="editAdmin">',
                    csrf(),
                    '<div class="separator">Editar administrador</div>',
                    '<input class="field" type="text" name="name" placeholder="Nombre"/>',
                    '<input class="field" type="password" name="password" placeholder="Contrase&ntilde;a"/>',
                    '<input class="field" type="password" name="password2" placeholder="Repetir contrase&ntilde;a"/>',
                    '<input class="button" type="submit" value="Editar administrador"/>',
                    '<input class="button" type="button" value="Atr&aacute;s"/>',
                '</form>'].join('\n');
    },

    /**
     * HTML of the warning that indicates the students that don't have a group
     * assigned.
     * @param n - Number of students with no group.
     * @return String - The HTML code of the warning.
     */
    adminShowUnassignedStudents: function(n) {
        var plural = "";
        if (n > 1) plural = "s";
        return ['<div id="warning" class="msg">',
                    'Hay '+n+' alumno' + plural + ' sin asignar',
                '</div>'].join('\n');
    },
    /**
     * Changes the border color and text color of the text field to red
     * in order to indicate an error.
     * @param field - The field to change.
     */
    fieldError: function(field) {
        field.css({'border': '1px solid #FF0000', "color": "#FF0000" });
    },
    /**
     * Changes the border color and text color of the text field to the
     * default values in the css file.
     * @param field - The field to restore.
     */
    fieldRestore: function(field) {
        field.bind('click focus',function() {
            field.css({'border': '1px solid #FFFFFF', "color": "#111111" });
        });
    },
    /**
     * Shows a popup with information based on the parameters.
     * @param parameters - Parsed URL parameters.
     */
    showMessage: function(parameters) {
        if (parameters !== "") {
            if (parameters == "nogroup")
                $('body').append('<div class="msg" id="error">Tu profesor a&uacute;n no te<br/>ha asignado ning&uacute;n grupo.<br/>Vuelve m&aacute;s tarde o contacta con &eacute;l.</div>');
            else if (parameters == "lerror")
                $('body').append('<div class="msg" id="error">Ese usuario con esa contrase&ntilde;a no existe.</div>');
            else if (parameters == "exists")
                $('body').append('<div class="msg" id="error">Este usuario ya está registrado...<br/>Usa otro correo y vuelve a intentarlo.</div>');
            else if (parameters == "registered")
                $('body').append('<div class="msg" id="ok">Registrado con éxito.<br/>Espera a que tu profesor te asigne un grupo.</div>');
            else if (parameters == "gexists")
                $('body').append('<div class="msg" id="error">El grupo ya existe.<br/>Escoge otro nombre.</div>');
            else if (parameters == "error")
                $('body').append('<div class="msg" id="error">Hubo un error.<br/>Vuelve a intentarlo.</div>');
            else if (parameters == "aok")
                $('body').append('<div class="msg" id="ok">Operación realizada correctamente.</div>');
        }
        $('.msg').fadeOut(4000,function(){
            $(this).remove();
        });
    },
    /**
     * Sets the elements (the groups) in the group dropdown list.
     * @param data - The groups data.
     */
    setGroupList: function(data) {
        $('select[id=group]').html('<option value="">Selecciona el grupo</option>');
        $('select[id=group]').val("");
        for (i = 0; i< data.length; i++) {
            $('select[id=group]').append('<option value=' + data[i].name + '>' + unescape(data[i].name) + '</option>');
        }
    },
    /**
     * Sets the elements (the students) in the student dropdown list.
     * @param data - The students data.
     */
    setStudentList: function(data) {
        $('select[id=student]').html('<option value="">Selecciona el alumno</option>');
        $('select[id=student]').val("");
        for (i = 0; i< data.length; i++) {
            $('select[id=student]').append('<option value=' + data[i].email + '>' + unescape(data[i].email) +  '</option>');
        }
    },
    /**
     * Sets the info of the student in the inputs for the viewStudent submenu.
     * @param data - The students data
     */
    setViewStudent: function(data) {
        $('input[name=name]').val(unescape(data.name));
        $('input[name=surname1]').val(unescape(data.surname1));
        $('input[name=surname2]').val(unescape(data.surname2));
        $('input[name=group]').val(unescape(data.group));
        $('input[name=level]').val("Nivel " + unescape(data.savegame));
        $('select[name=stats]').html('<option value="">Estadísticas</option>');
        $('select[name=stats]').val("");
        for (i = 0; i< data.stats.length; i++) {
            $('select[name=stats]').append('<option disabled value="'+data.stats[i].level+'">Nivel '+data.stats[i].level+": "+data.stats[i].date+'</option>');
        }
    },
    /**
     * Draws a loading window
     */
    loadingPopup: function(content) {
        var html = ['<div class="menu">',
                        '<div class="separator">Cargando...</div>',
                        '<p>Obteniendo información, espere...</p>',
                    '</div>'].join("\n");
        content.empty();
        content.append(html);
    },
    /**
     * getFieldLimitsMaxPass
     * @return Integer - The maximum field limit
     */
    getFieldLimitsMax: function() {
        return FIELD_LIMITS.MAX;
    },
    /**
     * getFieldLimitsMin
     * @return Integer - Theminimum field limit
     */
    getFieldLimitsMin: function() {
        return FIELD_LIMITS.MIN;
    },
};

  
});