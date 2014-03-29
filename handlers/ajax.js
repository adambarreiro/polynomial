// -----------------------------------------------------------------------------
// Name: /handlers/ajax.js
// Author: Adam Barreiro Costa
// Description: Sets all the AJAX handlers
// -----------------------------------------------------------------------------
var modelGroup = require('../models/group.js');
var modelStudent = require('../models/student.js');
var modelLevel = require('../models/level.js');

/**
 * Responds to the AJAX petition which asks for all the groups in the database.
 */
function ajaxGetGroups() {
    app.get('/getGroups', function (req, res) {
        modelGroup.getAllGroups(function(groups) {
            res.send(groups);
        });
    });
}
exports.ajaxGetGroups = ajaxGetGroups;

/**
 * Responds to the AJAX petition which asks for all the students, whether they
 * have a group assigned or not.
 */
function ajaxGetStudents() {
    app.get('/getStudentsWithGroup', function (req, res) {
        modelStudent.getAllStudents(true, function(students) {
            res.send(students);
        });
    });
    app.get('/getStudentsWithNoGroup', function (req, res) {
        modelStudent.getAllStudents(false, function(students) {
            res.send(students);
        });
    });
    app.get('/getAllStudents', function (req, res) {
        modelStudent.getAllStudents(null, function(students) {
            res.send(students);
        });
    });
}
exports.ajaxGetStudents = ajaxGetStudents;

/**
 * Responds to the AJAX petition which asks for the complete data of a specific
 * student.
 */
function ajaxGetStudent() {
    app.post('/getStudent', function (req, res) {
        modelStudent.searchStudent(unescape(req.body.email), function(student) {
            res.send(student);
        });
    });
}
exports.ajaxGetStudent = ajaxGetStudent;

/**
 * Responds to the AJAX petition which asks for the list of levels created.
 */
function ajaxGetLevelList() {
    app.post('/getLevelList', function (req, res) {
        modelLevel.getLevelSequence(function(levelList) {
            res.send(levelList);
        });
    });
}
exports.ajaxGetLevelList = ajaxGetLevelList;

/**
 * Responds to the AJAX petition which asks for the creation of a new level.
 */
function ajaxLevelCreate() {
    app.post('/levelCreate', function (req, res) {
        modelLevel.addLevel(function(level) {
            res.send(level);
        });
    });
}
exports.ajaxLevelCreate = ajaxLevelCreate;

/**
 * Responds to the AJAX petition which asks for the modification of a level.
 */
function ajaxLevelUpdate() {
    app.post('/levelUpdate', function (req, res) {
        modelLevel.updateLevel(req.body.number, JSON.parse(req.body.map), function(ok) {
            res.send(ok);
        });
    });
}
exports.ajaxLevelUpdate = ajaxLevelUpdate;

/**
 * Responds to the AJAX petition which asks for the load of a level.
 */
function ajaxLevelLoad() {
    app.post('/levelLoad', function (req, res) {
        modelLevel.getLevel(req.body.number, function(level) {
            res.send(level);
        });
    });
}
exports.ajaxLevelLoad = ajaxLevelLoad;

/**
 * Responds to the AJAX petition which asks for the removal of a level.
 */
function ajaxLevelDelete() {
    app.post('/levelDelete', function (req, res) {
        modelLevel.deleteLevel(req.body.number, function(ok) {
            res.send(ok);
        });
    });
}
exports.ajaxLevelDelete = ajaxLevelDelete;

/**
 * Responds to the AJAX petition which asks for moving a level.
 */
function ajaxLevelMove() {
    app.post('/levelMove', function (req, res) {
        modelLevel.moveLevel(req.body.from, req.body.to, function(ok) {
            res.send(ok);
        });
    });
}
exports.ajaxLevelMove = ajaxLevelMove;

/**
 * Responds to the AJAX petition which asks for saving a game.
 */
function ajaxSaveGame() {
    app.post('/saveGame', function (req, res) {
        modelStudent.setLevelStudent(req.body.student, req.body.level, function(ok) {
            res.send(ok);
        });
    });
}
exports.ajaxSaveGame = ajaxSaveGame;

/**
 * Responds to the AJAX petition which asks for saving a game.
 */
function ajaxLoadGame() {
    app.post('/loadGame', function (req, res) {
        modelStudent.getLevelStudent(req.body.email, function(data) {
            res.send(data);
        });
    });
}
exports.ajaxLoadGame = ajaxLoadGame;

/**
 * Responds to the AJAX petition which asks for the questions file.
 */
function ajaxGetQuestions() {
    app.post('/getQuestionsFile', function (req, res) {
        res.sendfile('public/assets/questions.txt');
    });
}
exports.ajaxGetQuestions = ajaxGetQuestions;

/**
 * Responds to the AJAX petition which asks for the timeouts file.
 */
function ajaxGetTimeouts() {
    app.post('/getTimeoutsFile', function (req, res) {
        res.sendfile('public/assets/timeouts.txt');
    });
}
exports.ajaxGetTimeouts = ajaxGetTimeouts;