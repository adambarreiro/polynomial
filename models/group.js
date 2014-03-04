// -----------------------------------------------------------------------------
// Name: /models/group.js
// Author: Adam Barreiro
// Description: Module with functions to manipulate database collections.
// Updated: 24-09-2013
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
var mongoose = require('mongoose');
var studentModel = require('./student.js');

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var groupSchema = new mongoose.Schema({
        name: String,
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    });
var Group = mongoose.model('Group', groupSchema);

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * Gets all the groups from the database.
 * @param callback(groups) - Function to call when the query finishes
 */
function getAllGroups(callback) {
    console.log("$ Petición de todos los grupos de alumnos.");
    Group.find(function (error, groups) {
        if (!error) callback(groups);
        else callback({});
    });
}
exports.getAllGroups = getAllGroups;

/**
 * searchGroup
 * Given a JSON object with data of a group, searches it.
 * @param data - Data with the group.
 * @param callback(group) - Function to call when the query finishes
 */
function searchGroup(data, callback) {
    console.log("$ Búsqueda de grupo " + data.name + ".");
    Group.findOne({
        name: data.name
    }, function (error, group) {
        if (!error) callback(group);
        else callback({});
    });
}
exports.searchGroup = searchGroup;

/**
 * Adds a group to the database.
 * @param n - Group's name.
 * @param callback(ok) - Function to call when the query finishes.
 */
function addGroup(n, callback) {
    console.log("$ Añadir el grupo " + n + ".");
    searchGroup({name: n}, function(group) {
        if (!group) {
            var g = Group({ name: n, students: [] });
            g.save(function () {
                callback(true);
            });
        } else callback(false);
    });
}
exports.addGroup = addGroup;

/**
 * Edits a group in the database.
 * @param o - Old name of the group
 * @param n - New name of the group
 * @param callback(ok) - Function to call when the query finishes
 */
function editGroup(o, n, callback) {
    console.log("$ Editar grupo " + o + " y llamarlo " + n + ".");
    Group.update({name: o}, { $set: { name: n }}, function(error, numberAffected) {
        if (numberAffected === 1) callback(true);
        else callback(false);
    });
}
exports.editGroup = editGroup;

/**
 * Given the name of a group, erases it from the database.
 * @param n - Name of the group to delete.
 * @param callback(ok) - Function to call when the query finishes
 */
function deleteGroup(n, callback) {
    console.log("$ Borrar grupo " + n + ".");
    // First, update references.
    studentModel.searchStudentsByGroup(n, function(students) {
        if (students) {
            for (var i = 0; i < students.length; i++) {
                Student.update({email: students[i].name},{$set: { unassigned: true} },function() { /*Do nothing*/ });
            }
        }
    });
    // Then delete the group
    Group.findOneAndRemove({name: n}, function(error) {
        if (error) callback(false);
        else callback(true);
    });
}
exports.deleteGroup = deleteGroup;

/**
 * Pushes a student to the student reference list of its group.
 * @param student - Student to add to its group.
 * @param callback(ok) - Function to call when the query finishes
 */
function pushStudent(student, callback) {
    Group.update({name: student.group}, { $push: { students: student}}, function(error, numberAffected) {
        if (numberAffected === 1) callback(true);
        else callback(false);
    });
}
exports.pushStudent = pushStudent;

/**
 * Pops a student from the student reference list of its group.
 * @param  student - Student to remove from its group.
 * @param callback(ok) - Function to call when the query finishes
 */
function popStudent(student, callback) {
    Group.update({name: student.group}, { $pop: { students: student}}, function(error, numberAffected) {
        if (numberAffected === 1) callback(true);
        else callback(false);
    });
}
exports.popStudent = popStudent;