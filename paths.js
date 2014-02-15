// -----------------------------------------------------------------------------
// Name: paths.js
// Author: Adam Barreiro Costa
// Description: Contains the functions to resolve some paths to some files.
// Updated: 30-10-2013
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
/**
 * keyPath
 * @return String - Path to the SSL public key file.
 */
function keyPath() {
    return 'certificates/server-key.pem';
}
exports.keyPath = keyPath;

/**
 * certPath
 * @return String - Path to the SSL certificate.
 */
function certPath() {
    return 'certificates/server-crt.pem';
}
exports.certPath = certPath;