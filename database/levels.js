// -----------------------------------------------------------------------------
// Name: configuration.js
// Author: Adam Barreiro Costa
// Description: Contains the functions to resolve some paths and config files.
// Updated: 03-03-2014
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
 * @param encoding - Encoding of the file. UTF-8 by default.
 * @return String - The file content
 */
function read(path, encoding) {
    if (check(path)) {
        if (encoding) {
            return fs.readFileSync(path, encoding);
        } else {
            return fs.readFileSync(path);
        }
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
    return read(HTTP_CONF, 'utf8');
}
exports.httpConfiguration = httpConfiguration;

/**
 * httpsConfiguration
 * @return String - Path to the HTTPS configuration
 */
function httpsConfiguration() {
    return read(HTTPS_CONF, 'utf8');
}
exports.httpsConfiguration = httpsConfiguration;

/**
 * databaseConfiguration
 * @return String - Path to the database configuration
 */
function databaseConfiguration() {
    return read(DATABASE_CONF, 'utf8');
}
exports.databaseConfiguration = databaseConfiguration;

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
    console.log("(i) INFO: Ficheros de configuración encontrados.");
    return true;
}
exports.checkConfiguration = checkConfiguration;