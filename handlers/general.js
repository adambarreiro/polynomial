// -----------------------------------------------------------------------------
// Name: /handlers/general.js
// Author: Adam Barreiro Costa
// Description: Reunites all the server handlers in one file
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Modules
// ----------------------------------------------------------------------------- 
var get = require('./get.js');
var post = require('./post.js');
var ajax = require('./ajax.js');

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
/**
 * Sets all the GET request handlers
 */
function setGetHandlers() {
    get.getIndex();
    get.getLogin();
    get.getRegister();
    get.getAdmin();
    get.getEditor();
    get.getGame();
    get.getLogout();
    //get.initAdmin();
}
exports.setGetHandlers = setGetHandlers;

/**
 * Sets all the POST request handlers
 */
function setPostHandlers(){
    post.postLogin();
    post.postRegister();
    post.postAdminCreateGroup();
    post.postAdminEditGroup();
    post.postAdminDeleteGroup();
    post.postAdminAssignGroup();
    post.postAdminDisposeGroup();
    post.postAdminEraseHistory();
    post.postAdminDeleteStudent();
    post.postAdminEditAdmin();
}
exports.setPostHandlers = setPostHandlers;

/**
 * Sets all the AJAX handlers
 */
function setAjaxHandlers() {
    ajax.ajaxGetGroups();
    ajax.ajaxGetStudents();
    ajax.ajaxGetStudent();
    ajax.ajaxGetLevelList();
    ajax.ajaxLevelCreate();
    ajax.ajaxLevelUpdate();
    ajax.ajaxLevelLoad();
    ajax.ajaxLevelDelete();
    ajax.ajaxLevelMove();
    ajax.ajaxSaveGame();
    ajax.ajaxLoadGame();
    ajax.ajaxGetQuestions();
    ajax.ajaxGetTimeouts();
}
exports.setAjaxHandlers = setAjaxHandlers;

function csrf(req, res, next) {
    //res.locals.csrftoken = req.csrfToken();
    res.cookie('token', res.locals.csrftoken);
    next();
}
exports.csrf = csrf;