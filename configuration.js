// -----------------------------------------------------------------------------
// Name: /configuration.js
// Author: Adam Barreiro Costa
// Description: Contains the functions to resolve some paths and config files.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
var fs = require('fs');

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var KEY_PATH = 'certificates/server-key.pem';
var CERT_PATH = 'certificates/server-crt.pem';
var HTTP_CONF = 'configuration/http_port.txt';
var HTTPS_CONF = 'configuration/https_port.txt';
var DATABASE_CONF = 'configuration/database.txt';
var GROUPS_NEEDED = 'configuration/groups_needed.txt';
var ENCODING = "utf8";

/**
 * Checks the existance of a file
 * @param  path - The file path
 * @return Boolean - The existance
 */
function check(path) {
    return fs.existsSync(path);
}

/**
 * Returns the content of a file if exists. Empty string in other case.
 * @param path - Path of the file
 * @return String - The file content
 */
function read(path) {
    if (check(path)) {
        return fs.readFileSync(path, ENCODING);
    } else return "";
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * keyConfiguration
 * @return String - The SSL public key file.
 */
function keyConfiguration() {
    return read(KEY_PATH);
}
exports.keyConfiguration = keyConfiguration;

/**
 * certConfiguration
 * @return String - The SSL certificate.
 */
function certConfiguration() {
    return read(CERT_PATH);
}
exports.certConfiguration = certConfiguration;

/**
 * httpConfiguration
 * @return String - Path to the HTTP configuration
 */
function httpConfiguration() {
    var port = parseInt(read(HTTP_CONF),10);
    if (isNaN(port)) return 80;
    else return port;
}
exports.httpConfiguration = httpConfiguration;

/**
 * httpsConfiguration
 * @return String - Path to the HTTPS configuration
 */
function httpsConfiguration() {
    var port = parseInt(read(HTTPS_CONF),10);
    if (isNaN(port)) return 443;
    else return port;
}
exports.httpsConfiguration = httpsConfiguration;

/**
 * databaseConfiguration
 * @return String - Path to the database configuration
 */
function databaseConfiguration() {
    return read(DATABASE_CONF);
}
exports.databaseConfiguration = databaseConfiguration;

/**
 * groupsNeededConfiguration
 * @return String - Path to the group needed configuration
 */
function groupsNeededConfiguration() {
    if (read(GROUPS_NEEDED) === "false") return false;
    else return true;
}
exports.groupsNeededConfiguration = groupsNeededConfiguration;

/**
 * Checks all the configuration files
 * @return Boolean - True if everything is OK
 */
function checkConfiguration() {
    var ok = true;
    ok = check(KEY_PATH);
    if (!ok) {
        console.log("(!) ERROR: Falta archivo " + KEY_PATH);
        return false;
    }
    ok = check(CERT_PATH);
    if (!ok) {
        console.log("(!) ERROR: Falta archivo " + CERT_PATH);
        return false;
    }
    ok = check(HTTP_CONF);
    if (!ok) {
        console.log("(!) ERROR: Falta archivo " + HTTP_CONF);
        return false;
    }
    ok = check(HTTPS_CONF);
    if (!ok) {
        console.log("(!) ERROR: Falta archivo " + HTTPS_CONF);
        return false;
    }
    ok = check(DATABASE_CONF);
    if (!ok) {
        console.log("(!) ERROR: Falta archivo " + DATABASE_CONF);
        return false;
    }
    ok = check(GROUPS_NEEDED);
    if (!ok) {
        console.log("(!) ERROR: Falta archivo " + GROUPS_NEEDED);
        return false;
    }
    console.log("(i) INFO: Ficheros de configuración encontrados.");
    return true;
}
exports.checkConfiguration = checkConfiguration;