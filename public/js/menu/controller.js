// -----------------------------------------------------------------------------
// Name: /public/js/menu/controller.js
// Author: Adam Barreiro Costa
// Description: Module with all the functions needed to handle events on the
// screen.
// -----------------------------------------------------------------------------

/**
 * Controller - RequireJS
 * @dependency /public/js/menu/view.js
 * @dependency /public/js/menu/controller.js
 */
define (["./view", "require", "./controller"], function(View, Require) {

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------

/**
 * Returns true if the length of a text exceeds a limit given.
 * @param text - The text to check.
 * @param limitUp - Limit that must not be exceeded.
 * @param limitDown - Limit that must BE exceeded. If <=0 ignores it.
 * @return Boolean - True if the length is allright.
 */
function lengthCheck(text, limitUp, limitDown) {
    var r = text.length <= limitUp;
    if (limitDown > 0)
        r = r && (text.length >= limitDown);
    return r;
}

/**
 * Checks if the text has valid characters for an e-mail.
 * @param text - The text to check.
 * @return Boolean - True if text is correct.
 */
function checkMail(text) {
    if (!lengthCheck(text, View.getFieldLimitsMax(), -1))
        return false;
    else
        return ( /^[A-Za-z0-9\_\-\.]+\@[A-Za-z0-9\_\-\.]+(\.[A-Za-z0-9]{1,3})$/ ).test(text);
}
/**
 * Checks if the text has valid characters for a generic text depending on
 * the parameters given: Only letters, or only letters and numbers, etc.
 * @param text - The text to check.
 * @param allowEmpty - Allows the text to be empty.
 * @param allowNumbers - Allows the text to have numbers.
 * @return Boolean - True if text is correct.
 */
function checkText(text, allowEmpty, allowNumbers) {
    var regex = /^(\ *[A-Za-zÁáÉéÍíÓóÚúÜüºª]+\ *)+$/;
    if (allowNumbers) regex = /^(\ *[A-Za-z0-9ÁáÉéÍíÓóÚúÜüºª]+\ *)+$/;
    if (!lengthCheck(text, View.getFieldLimitsMax(), -1))
        return false;
    else
        if (!allowEmpty)
            return regex.test(text);
        else
            return (text === "") || regex.test(text);
}
/**
 * Checks if the text is correct for a password.
 * @param text - The text to check.
 * @return Boolean - True if text is correct.
 */
function checkPassword(text) {
    return lengthCheck(text, View.getFieldLimitsMax(), View.getFieldLimitsMin());
}

/**
 * Checks if the two passwords given as parameters are equivalent.
 * @param pass - The password to check.
 * @param check - The repeated password to check.
 * @return Boolean - True if they match.
 */
function checkPasswords(pass, check) {
    if (pass === check) {
        if (checkPassword(pass)) {
            return true;
        }
    }
    return false;
}

/**
 * checkNumber
 * Checks if the text is a number.
 * @param text - The text to check.
 * @return Boolean - True if text is correct.
 */
function checkNumber(text) {
    return !isNaN(parseFloat(text)) && isFinite(text);
}

/**
 * Sets the event handlers to the submenu parts of the administration menu.
 * By now, there's only the back button event.
 * @param content - The content of the page.
 */
function adminSetSubmenuHandlers(content) {
    var Controller = Require("controller");
    content.find(":button").bind('click',function() {
        content.empty();
        content.append(View.adminGetPanel());
        Controller.adminSetHandlers(content);
    });
}

/**
 * Sets the behaviour of the submenus related to groups.
 * @param content - The content of the page.
 */
function adminSetSubmenuGroupHandlers(content) {
    var form = content.find("form");
    var nameField = content.find("input[name='name']");
    // Element binding
    form.on('submit', function(event) {
        var bad = false;
        // Change the view if error
        if (!checkText(nameField.val(), false, true)) {
            bad = true; View.fieldError(nameField); View.fieldRestore(nameField);
        }
        if (bad) {
            bad = false; event.preventDefault();
        }
    });
    adminSetSubmenuHandlers(content);
}

/**
 * Sets the behaviour of the administrator edition submenu.
 * @param content - The content of the page.
 */
function adminSetSubmenuAdminHandlers(content) {
    var form = content.find("form");
    var nameField = content.find("input[name='name']");
    var passField1 = content.find("input[name='password']");
    var passField2 = content.find("input[name='password2']");
    // Element binding
    form.on('submit', function(event) {
        var bad = false;
        // Change the view if error
        if ( !checkText(nameField.val(),false, true) ) {
            bad = true; View.fieldError(nameField); View.fieldRestore(nameField);
        }
        if ( !checkPasswords(passField1.val(), passField2.val()) ) {
            bad = true; View.fieldError(passField1); View.fieldError(passField2);
            View.fieldRestore(passField1); View.fieldRestore(passField2);
        }
        if (bad) {
            bad = false; event.preventDefault();
        }
    });
    adminSetSubmenuHandlers(content);
}

/**
 * Sets the behaviour of the student view submenu.
 */
function adminSetSubmenuViewStudentHandlers() {
    var select = content.find("select");
    // Element binding
    var Controller = Require("controller");
    select.change(function() {
        Controller.ajaxGetStudent($(this).val(), function(data) {
            View.setViewStudent(data);
        });
    });
    adminSetSubmenuHandlers(content);
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {

    /**
     * Sets the behaviour of all the elements in the login panel.
     * @param content - The content of the page.
     */
    loginSetHandlers: function(content) {
        // Elements.
        var form = content.find("form");
        var email = content.find(":text");
        var pass = content.find(":password");
        var register = content.find(":button");

        // Element binding.
        register.bind('click',function() {
           window.location = "/register";
        });
        form.on('submit', function(event) {
            var bad = false;
            // Change the view if error.
            if ( !checkMail(email.val()) && !checkText(email.val(),false, true)) {
                bad = true; View.fieldError(email); View.fieldRestore(email);
            }
            if ( !checkPassword(pass.val()) ) {
                bad = true; View.fieldError(pass); View.fieldRestore(pass);
            }
            if (bad) {
                bad = false; event.preventDefault();
            }

        });
    },

    /**
     * Sets the behaviour of all the elements in the register panel.
     * @param content - The content of the page.
     */
    registerSetHandlers: function(content) {
        // Elements.
        var form = content.find("form");
        var back = content.find(":button");
        var emailField = content.find("input[name='email']");
        var passField1 = content.find("input[name='password']");
        var passField2 = content.find("input[name='password2']");
        var nameField = content.find("input[name='name']");
        var surnameField1 = content.find("input[name='surname1']");
        var surnameField2 = content.find("input[name='surname2']");
        var groupField = content.find("select[name='group']");

        // Element binding.
        back.bind('click',function() {
            window.location = "/login";
        });
        form.on('submit', function(event) {
            var bad = false;
            // Change the view if error.
            if ( !checkMail(emailField.val()) ) {
                bad = true; View.fieldError(emailField); View.fieldRestore(emailField);
            }
            if ( !checkPasswords(passField1.val(), passField2.val()) ) {
                bad = true; View.fieldError(passField1); View.fieldError(passField2);
                View.fieldRestore(passField1); View.fieldRestore(passField2);
            }
            if ( !checkText(nameField.val(),false, false) ) {
                bad = true; View.fieldError(nameField); View.fieldRestore(nameField);
            }
            if ( !checkText(surnameField1.val(),false, false) ) {
                bad = true; View.fieldError(surnameField1); View.fieldRestore(surnameField1);
            }
            if ( !checkText(surnameField2.val(),true, false) ) {
                bad = true; View.fieldError(surnameField2); View.fieldRestore(surnameField2);
            }
            if ( groupField.val() === " " ) {
                bad = true; View.fieldError(groupField); View.fieldRestore(groupField);
            }
            if (bad) {
                bad = false; event.preventDefault();
            }
        });
    },

    /**
     * Starts the event handler for the popups that appear in the registration
     * section when you move the mouse over the fields.
     * @param content - The content of the page.
     */
    registerIndicationsPopup: function(content) {
        var fields = content.find(".field");
        fields.each(function(i, field) {
            $(field).on("mouseover", function() {
                View.registerPopupsOn($(field),$(field).attr("name"));
            });
            $(field).on("mouseleave", function(e) {
                View.registerPopupsOff();
            });
        });
    },
    /**
     * Sets the behaviour of all the elements in the admin panel.
     * @param content - The content of the page.
     */
    adminSetHandlers: function(content) {
        var Controller = Require("controller");
        // Element binding.
        content.find("#createGroup").bind('click',function() {
            content.empty();
            content.append(View.adminCreateGroup());
            adminSetSubmenuGroupHandlers(content);
        });
        content.find("#editGroup").bind('click',function() {
            View.loadingPopup(content);
            Controller.ajaxGetGroups(function(data) {
                content.empty();
                content.append(View.adminEditGroup());
                View.setGroupList(data);
                adminSetSubmenuGroupHandlers(content);
            });
        });
        content.find("#deleteGroup").bind('click',function() {
            View.loadingPopup(content);
            Controller.ajaxGetGroups(function(data) {
                content.empty();
                content.append(View.adminDeleteGroup());
                View.setGroupList(data);
                adminSetSubmenuHandlers(content);
            });
        });
        content.find("#assignGroup").bind('click',function() {
            View.loadingPopup(content);
            Controller.ajaxGetStudents(false, function(data1) {
                Controller.ajaxGetGroups(function(data2) {
                    content.empty();
                    content.append(View.adminAssignGroup());
                    View.setGroupList(data2);
                    View.setStudentList(data1);
                    adminSetSubmenuHandlers(content);
                });
            });
        });
        content.find("#disposeGroup").bind('click',function() {
            View.loadingPopup(content);
            Controller.ajaxGetStudents(true, function(data) {
                content.empty();
                content.append(View.adminDisposeGroup());
                View.setStudentList(data);
                adminSetSubmenuHandlers(content);
            });
        });
        content.find("#viewStudent").bind('click',function() {
            View.loadingPopup(content);
            Controller.ajaxGetStudents(null, function(data) {
                content.empty();
                content.append(View.adminViewStudent());
                View.setStudentList(data);
                adminSetSubmenuViewStudentHandlers(content);
            });
        });
        content.find("#deleteStudent").bind('click',function() {
            View.loadingPopup(content);
            Controller.ajaxGetStudents(null, function(data) {
                content.empty();
                content.append(View.adminDeleteStudent());
                View.setStudentList(data);
                adminSetSubmenuHandlers(content);
            });
        });
        content.find("#editAdmin").bind('click',function() {
            content.empty();
            content.append(View.adminEditAdmin());
            adminSetSubmenuAdminHandlers(content);
        });
        $('body').find("#edbutton").bind('click',function() {
            window.location = "/editor";
        });
    },

    /**
     * Parse all URL parameters and changes the view.
     */
    getParameters: function() {
        View.showMessage(window.location.search.replace("?",""));
    },
    csrfAjax: function() {
        var pri = document.cookie.indexOf("token=")+"token=".length;
        var fin = document.cookie.indexOf(";", pri);
        if (fin < 0) {
            fin = document.cookie.length;
        }
        jQuery.ajaxPrefilter(function(options, _, xhr) {
            if (!xhr.crossDomain)
                xhr.setRequestHeader('X-CSRF-Token', document.cookie.substring(pri,fin));
        });
    },
    /**
     * Makes an AJAX petition to the server in order to get all the groups in
     * the database.
     * @param callback(data) - The function to callback when the query finishes.
     */
    ajaxGetGroups: function(callback) {
        $.ajax({
            url: '/getGroups',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                callback(data);
            }
        });
    },
    /**
     * Makes an AJAX petition to the server in order to get all the students in
     * the database. The students chosen depend on the parameters given.
     * @param withGroup - If it's null returns all the students. If it's true
     * returns the students with group. If it's false returns the students with
     * no group assigned.
     * @param callback(data) - The function to callback when the query finishes.
     */
    ajaxGetStudents: function(withGroup, callback) {
        if (withGroup !== null) {
            if (withGroup) {
                $.ajax({
                    url: '/getStudentsWithGroup',
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        callback(data);
                    }
                });
            } else {
                $.ajax({
                    url: '/getStudentsWithNoGroup',
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        callback(data);
                    }
                });
            }
        } else {
            $.ajax({
                    url: '/getAllStudents',
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        callback(data);
                    }
                });
        }
    },
    /**
     * Makes an AJAX petition to the server in order to get an specific student in
     * the database.
     * @param email - The student's email.
     * @param callback(data) - The function to callback when the query finishes.
     */
    ajaxGetStudent: function(email, callback) {
        $.ajax({
            url: '/getStudent',
            type: 'POST',
            data: {email: email},
            dataType: 'json',
            success: function(data) {
                callback(data);
            }
        });
    }
};

});