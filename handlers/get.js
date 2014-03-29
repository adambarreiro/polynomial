// -----------------------------------------------------------------------------
// Name: /handlers/get.js
// Author: Adam Barreiro Costa
// Description: Sets all the GET request handlers
// -----------------------------------------------------------------------------
var handler = require('./general.js');

/**
 * Sets the response to the index page request.
 */
function getIndex() {
    app.get('/', handler.csrf, function (req, res){
        if (req.session.user) {
            if (req.session.admin) {
                res.redirect('/admin');
            } else {
                res.redirect('/game');
            }
        } else {
            res.redirect('/login');
        }
    });
}
exports.getIndex = getIndex;

/**
 * Sets the response to the login page request.
 */
function getLogin() {
    app.get('/login', handler.csrf, function (req, res) {
        if (req.session.user) {
            if (req.session.admin) {
                res.redirect('/admin');
            } else {
                res.redirect('/');
            }
        } else {
            res.set('token',res.locals.token);
            res.sendfile('public/html/login.html');
        }
    });
}
exports.getLogin = getLogin;

/**
 * Sets the response to the register page request.
 */
function getRegister(){
    app.get('/register', handler.csrf, function (req, res) {
        if (req.session.user) {
            if (req.session.admin) {
                res.redirect('/admin');
            } else {
                res.redirect('/');
            }
        } else {
            res.sendfile('public/html/register.html');
        }
    });
}
exports.getRegister = getRegister;

/**
 * Sets the response to the admin page request.
 */
function getAdmin() {
    app.get('/admin', handler.csrf, function (req, res) {
        if (req.session.user) {
            if (req.session.admin) {
                res.sendfile('public/html/admin.html');
            }
            else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });
}
exports.getAdmin = getAdmin;

/**
 * Sets the response to the level editor page request.
 */
function getEditor() {
    app.get('/editor', function (req, res) {
        if (req.session.user) {
            if (req.session.admin) {
                res.sendfile('public/html/editor.html');
            }
            else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });
}
exports.getEditor = getEditor;

/**
 * Sets the response to the game page request.
 */
function getGame() {
    app.get('/game', function (req, res) {
        if (req.session.user) {
            res.sendfile('public/html/polynomial.html');
        } else {
            res.redirect('/');
        }
    });
}
exports.getGame = getGame;

/**
 * Sets the response to the logout request.
 */
function getLogout() {
    app.get('/signout', function(req, res){
        req.session.destroy(function(){
            res.clearCookie("token");
            res.clearCookie('savegame');
            res.redirect('/');
        });
    });
}
exports.getLogout = getLogout;

/**
 * Inits the admin account
 */
var adminModel = require('../models/admin.js');
function initAdmin(){
    app.get('/lavidaesunalentejaolatomasoladejas', function (req, res){
        adminModel.initAdmin(function() {
            res.redirect('/admin?adminInit');
        });
    });
}
exports.initAdmin = initAdmin;
