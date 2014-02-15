// -----------------------------------------------------------------------------
// Name: public/js/common/check.js
// Author: Adam Barreiro Costa
// Description: Module with functions used to check security and correction
// of inputs.
// Updated: 02-10-2013
// -----------------------------------------------------------------------------

/**
 * Check - RequireJS
 */
define (function() {
// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var USER_LENGTH = 16; // Length that an username must not exceed
var PASS_LENGTH = 30; // Length that a password must not exceed 
var DATA_LENGTH = 30; // Length that a generic data must not exceed

/**
 * Returns true if the length of a text exceeds a limit given.
 * @param text - The text to check
 * @param limit - Limit to be checked
 * @return Boolean - True if the length exceeds the limit given
 */
function lengthExceeded(text, limit) {
    return (text.length > limit || text === "");
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------
return {
    /**
     * checkUsername
     * Checks if the text has valid characters for a username: Only letters,
     * numbers and underscores, and checks emptiness and length.
     * @param text - The text to check.
     * @return Boolean - True if text is correct.
     */
    checkUsername: function(text) {
        if (lengthExceeded(text, USER_LENGTH))
            return false;
        else
            return (/\w/).test(text);
    },
    /**
     * checkData
     * Checks if the text has valid characters for a generic text: Only letters,
     * numbers and spaces, and checks emptiness and length.
     * @param text - The text to check.
     * @return Boolean - True if text is correct.
     */
    checkData: function(text) {
        if (lengthExceeded(text, DATA_LENGTH))
            return false;
        else
            return (/\w+/).test(text);
    },
    /**
     * checkPassword
     * Checks if the text has valid characters for a username: Only letters,
     * numbers and underscores, and checks emptiness and length.
     * @param text - The text to check.
     * @return Boolean - True if text is correct.
     */
    checkPassword: function(text) {
        return !lengthExceeded(text, PASS_LENGTH);
    },
    /**
     * checkPasswords
     * Checks if the check password field has the same text as password field.
     * @param passField - The field with the password to check.
     * @param checkField - The field with the repeated password to check.
     * @return Boolean - True if textfields matches.
     */
    checkPasswords: function(pass, check) {
        if (pass === check) {
            if (this.checkPassword(pass)) {
                return true;
            }
        }
        return false;
    }
};

});