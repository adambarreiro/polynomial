// -----------------------------------------------------------------------------
// Name: /models/admin.js
// Author: Adam Barreiro
// Description: Module with functions to manipulate administrators in the database.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
var crypto = require("crypto");
var mongoose = require('mongoose');

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var adminSchema = new mongoose.Schema({
    user: String,
    password: String,
});
var Admin = mongoose.model('Admin', adminSchema);

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * Searches an admin with an user and password.
 * @param u - Admin's username
 * @param p - Admin's password
 * @param callback(ok, admin) - Function to call when the query finishes
 */
function loginAdmin(u, p, callback) {
    console.log("$ Login de administrador.");
    // Encrypt password
    var sha256 = crypto.createHash("sha256");
    sha256.update(p, "utf8");
    // Search
    Admin.findOne({
        user: u,
        password: sha256.digest("base64")
    }, function (error, admin) {
        if (!error) callback(true, admin);
        else callback(false, {});
    });
}
exports.loginAdmin = loginAdmin;

/**
 * Given an admin's username and password, updates the admin's info.
 * @param u - Admin's username.
 * @param p - Admin's password.
 * @param callback(exists) - Function to call when the query finishes
 */
function editAdmin(u, p, callback) {
    console.log("$ Edición de administrador.");
    Admin.findOne(function (error, old) {
        if (!error) {
            var sha256 = crypto.createHash("sha256");
            sha256.update(p, "utf8");
            Admin.update( {user: old.user}, { $set: { user: u, password: sha256.digest("base64")}}, function(error, numberAffected) {
                if (numberAffected === 1)
                    callback(true);
                else callback(false);
            });
        }
    });
}
exports.editAdmin = editAdmin;

/*function initAdmin(callback) {
    console.log("$ Inicialización de administrador.");
    var sha256 = crypto.createHash("sha256");
    sha256.update("1234567890", "utf8");
    admin = Admin({
        user: "admin",
        password: sha256.digest("base64"),
    });
    admin.save(function () {
        callback(false);
    });
}
exports.initAdmin = initAdmin;*/