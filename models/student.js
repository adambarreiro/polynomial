// -----------------------------------------------------------------------------
// Name: /models/student.js
// Author: Adam Barreiro Costa
// Description: Module with functions to manipulate students in the database.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
var crypto = require("crypto");
var mongoose = require('mongoose');
var groupModel = require('./group.js');

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var studentSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    surname1: String,
    surname2: String,
    group: { type: String, ref: 'Group' },
    savegame: Number,
    stats: [mongoose.Schema.Types.Mixed]
});
var Student = mongoose.model('Student', studentSchema);

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * Gets all the students from the database.
 * @param withGroup - Returns the students if they have a group assigned
 * @param callback(students) - Function to call when the query finishes
 */
function getAllStudents(withGroup, callback) {
    console.log("$ Obtener todos los estudiantes.");
    if (withGroup !== null) {
        if (withGroup) {
            Student.find({group: {'$ne': "" }}, function (error, students) {
                if (!error) callback(students);
                else callback({});
            });
        } else {
            Student.find({group: { '$not': { '$ne': "" } }}, function (error, students) {
                if (!error) callback(students);
                else callback({});
            });
        }
        
    } else {
        Student.find({}, function (error, students) {
            if (!error) callback(students);
            else callback({});
        });
    }
}
exports.getAllStudents = getAllStudents;

/**
 * Given a mail of a student, retrieves all his information.
 * @param e - Mail of the student.
 * @param callback(student) - Function to call when the query finishes
 */
function searchStudent(e, callback) {
    console.log("$ Buscar al estudiante " + e + ".");
    Student.findOne({
        email: e
    }, function (error, student) {
        if (!error) callback(student);
        else callback({});
    });
}
exports.searchStudent = searchStudent;

/**
 * Searches a student with an email and password.
 * @param e - Student's email
 * @param p - Student's password
 * @param callback(ok, student) - Function to call when the query finishes
 */
function loginStudent(e, p, callback) {
    console.log("$ Login de estudiante " + e + ".");
    var sha256 = crypto.createHash("sha256");
    sha256.update(p, "utf8");
    Student.findOne({
        email: e,
        password: sha256.digest("base64")
    }, function (error, student) {
        if (!error)
            if (student) callback(true, student);
            else callback(false, {});
        else callback(false, {});
    });
}
exports.loginStudent = loginStudent;

/**
 * Adds a student to the database.
 * @param e - Mail of the student.
 * @param p - Password of the student.
 * @param n - Name of the student.
 * @param s1 - First surname of the student.
 * @param s2 - Second surname of the student.
 * @param callback(ok) - Function to call when the query finishes
 */
function addStudent(e, p, n, s1, s2, callback) {
    console.log("$ Añadir un estudiante " + e + ".");
    searchStudent(e, function(student){
        if (!student) {
            var sha256 = crypto.createHash("sha256");
            sha256.update(p, "utf8");
            student = Student({
                email: e,
                password: sha256.digest("base64"),
                name: n,
                surname1: s1,
                surname2: s2,
                group: "",
                savegame: 1
            });
            student.save(function () {
                callback(true);
            });
        }
        else callback(false);
    });
}
exports.addStudent = addStudent;

/**
 * Given a name of a group, searches all the students assigned to it.
 * @param n - Name of the group
 * @param callback(students) - Function to call when the query finishes
 */
function searchStudentsByGroup(n, callback) {
    console.log("$ Buscar un estudiante con grupo " + n + ".");
    Student.find({
        group: n
    }, function (error, students) {
        callback(students);
    });
}
exports.searchStudentsByGroup = searchStudentsByGroup;

/**
 * Given a mail of a student, sets a new group to him.
 * @param e - Mail of the student.
 * @param g - Name of the group.
 * @param callback(error) - Function to call when the query finishes
 */
function assignGroup(e, g, callback) {
    console.log("$ Asignar un grupo " + g + " al estudiante " + e + ".");
    Student.update({email: e}, { $set: { group: g}}, function(error, numberAffected) {
        if (numberAffected === 1) {
            Student.findOne({email: e}, function(error, student){
                if (!error) {
                    groupModel.pushStudent(student, function(ok) {
                        if (ok) callback(true);
                        else callback(false);
                    });
                } else {
                    callback(false);
                }
            });
        }
        else callback(false);
    });
}
exports.assignGroup = assignGroup;

/**
 * Given a mail of a student, erases the group that was assigned to him.
 * @param e - Mail of the student.
 * @param callback(ok) - Function to call when the query finishes
 */
function disposeGroup(e, callback) {
    console.log("$ Borrarle el grupo a " + e + ".");
    Student.findOne({email: e}, function(error, student){
        if (!error) {
            groupModel.popStudent(student, function(ok) {
                if (ok) {
                    Student.update({email: e}, { $set: { group: ""}},
                    function(error, numberAffected) {
                        if (numberAffected === 1) {
                            callback(true);
                        }
                        else callback(false);
                    });
                } else {
                    callback(false);
                }
            });
        }
    });
}
exports.disposeGroup = disposeGroup;

/**
 * Sets the group
 * @param e - Mail of the student.
 * @param g - Group of the student.
 */
function setGroup(e, g, callback) {
    Student.update({email: e}, { $set: { group: g} }, callback);
}
exports.setGroup = setGroup;

/**
 * Given an mail of a student, deletes it from the database.
 * @param data - Data with the student. 
 * @param callback(students) - Function to call when the query finishes
 */
function deleteStudent(e, callback) {
    console.log("$ Borrar el estudiante " + e + ".");
    Student.findOne({email: e}, function(error, student){
        if (!error) {
            if (student.group !== "") {
                groupModel.popStudent(student, function(ok) {
                    if (ok) {
                        student.remove(function(error) {
                            if (error) callback(false);
                            else callback(true);
                        });
                    }
                });
            } else {
                student.remove(function(error) {
                    if (error) callback(false);
                    else callback(true);
                });
            }

        }
    });
}
exports.deleteStudent = deleteStudent;

/**
 * Given an mail of a student, updates the level of the game
 * @param e - Email of the student
 * @param l - Level of the student
 * @param callback(students) - Function to call when the query finishes
 */
function setLevelStudent(e, l, callback) {
    console.log("$ Asignarle el nivel " + l + " al estudiante " + e + ".");
    var stud = unescape(e);
    var dateUnformatted = new Date();
    var date = ("0" + (+dateUnformatted.getDate()+1)).slice(-2) + "/" + ("0"+(+dateUnformatted.getMonth()+1)).slice(-2) + "/" + dateUnformatted.getFullYear() + " a las " +
               ("0"+dateUnformatted.getHours()).slice(-2) + ":" + ("0"+dateUnformatted.getMinutes()).slice(-2);
    if (l == 1) {
        Student.update({email: stud}, { $set: {savegame: l, stats: [{level: l, date: date}] } }, function(error) {
            if (!error) callback({ok: true});
            else callback({ok: false});
        });
    } else {
        Student.update({email: stud}, { $set: {savegame: l}, $push: {stats: {level: l, date: date}}}, function(error) {
            if (!error) callback({ok: true});
            else callback({ok: false});
        });
    }

}
exports.setLevelStudent = setLevelStudent;

/**
 * Given an mail of a student, returns his actual level
 * @param e - Email of the student
 * @param callback(level) - Function to call when the query finishes
 */
function getLevelStudent(e, callback) {
    console.log("$ Cargar el nivel actual del estudiante " + e + ".");
    var stud = unescape(e);
    Student.findOne({ email: stud }, function (error, student) {
        if (!error) callback({level: student.savegame});
        else callback({});
    });
}
exports.getLevelStudent = getLevelStudent;

