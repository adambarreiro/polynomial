// -----------------------------------------------------------------------------
// Name: /handlers/post.js
// Author: Adam Barreiro Costa
// Description: Sets all the POST request handlers
// Updated: 23-10-2013
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
var studentModel = require('../models/student.js');
var groupModel = require('../models/group.js');
var adminModel = require('../models/admin.js');

/**
 * Sets the response to the login request.
 */
function postLogin() {
    app.post('/signin', function (req, res) {
        studentModel.loginStudent(escape(req.body.email), escape(req.body.password), function(ok, student) {
            if (ok) {
                if (student) {
                    if (student.group !== "") {
                        req.session.regenerate(function(){
                            res.cookie('student', student.email);
                            req.session.user = student;
                            req.session.admin = false;
                            res.redirect('/');
                        });
                    } else res.redirect('/login?nogroup');
                } else {
                    res.redirect('/login?lerror');
                }
            }
            // No student, search admin
            else {
                adminModel.loginAdmin(escape(req.body.email), escape(req.body.password), function(ok, admin) {
                    if (ok) {
                        if (admin) {
                            req.session.regenerate(function(){
                                req.session.user = admin;
                                req.session.admin = true;
                                res.redirect('/');
                            });
                        } else {
                            res.redirect('/login?lerror');
                        }
                    }
                    else res.redirect('/login?error');
                });
            }
        });
    });
}
exports.postLogin = postLogin;

/**
 * Sets the response to the register  request.
 */
function postRegister(){
    app.post('/signup', function (req, res){
        studentModel.addStudent(escape(req.body.email),escape(req.body.password),escape(req.body.name),escape(req.body.surname1),escape(req.body.surname2), function(ok) {
            if (ok) res.redirect('/login?registered');
            else res.redirect('/register?exists');
        });
    });
}
exports.postRegister = postRegister;

/**
 * Sets the response to the createGroup request.
 */
function postAdminCreateGroup(){
    app.post('/createGroup', function (req, res){
        groupModel.addGroup(escape(req.body.name), function(ok) {
            if (ok) res.redirect('/admin?aok');
            else res.redirect('/admin?gexists');
        });
    });
}
exports.postAdminCreateGroup = postAdminCreateGroup;

/**
 * Sets the response to the editGroup request.
 */
function postAdminEditGroup(){
    app.post('/editGroup', function (req, res){
        groupModel.editGroup(escape(req.body.original), escape(req.body.name), function(ok) {
            if (ok) res.redirect('/admin?aok');
            else res.redirect('/admin?error');
        });
    });
}
exports.postAdminEditGroup = postAdminEditGroup;

/**
 * Sets the response to the editGroup request.
 */
function postAdminDeleteGroup(){
    app.post('/deleteGroup', function (req, res){
        groupModel.deleteGroup(escape(req.body.name), function(ok) {
            if (ok) res.redirect('/admin?aok');
            else res.redirect('/admin?error');
        });
    });
}
exports.postAdminDeleteGroup = postAdminDeleteGroup;

/**
 * Sets the response to the assignGroup request.
 */
function postAdminAssignGroup(){
    app.post('/assignGroup', function (req, res){
        studentModel.assignGroup(escape(req.body.name), escape(req.body.group), function(ok) {
            if (ok) res.redirect('/admin?aok');
            else res.redirect('/admin?error');
        });
    });
}
exports.postAdminAssignGroup = postAdminAssignGroup;

/**
 * Sets the response to the disposeGroup request.
 */
function postAdminDisposeGroup(){
    app.post('/disposeGroup', function (req, res){
        studentModel.disposeGroup(escape(req.body.name), function(ok) {
            if (ok) res.redirect('/admin?aok');
            else res.redirect('/admin?error');
        });
    });
}
exports.postAdminDisposeGroup = postAdminDisposeGroup;

/**
 * Sets the response to the deleteStudent request.
 */
function postAdminDeleteStudent(){
    app.post('/deleteStudent', function (req, res){
        studentModel.deleteStudent(escape(req.body.name), function(ok) {
            if (ok) res.redirect('/admin?aok');
            else res.redirect('/admin?error');
        });
    });
}
exports.postAdminDeleteStudent = postAdminDeleteStudent;

/**
 * Sets the response to the editAdmin request.
 */
function postAdminEditAdmin(){
    app.post('/editAdmin', function (req, res){
        adminModel.editAdmin(unescape(req.body.name), unescape(req.body.password), function(ok) {
            if (ok) res.redirect('/admin?aok');
            else res.redirect('/admin?error');
        });
    });
}
exports.postAdminEditAdmin = postAdminEditAdmin;