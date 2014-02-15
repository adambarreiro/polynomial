// -----------------------------------------------------------------------------
// Name: models/level.js
// Author: Adam Barreiro
// Description: Module with functions to manipulate levels in the database.
// Updated: 27-10-2013
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
var mongoose = require('mongoose');

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
var levelSchema = new mongoose.Schema({
    number: Number,
    map: mongoose.Schema.Types.Mixed
});
var Level = mongoose.model('Level', levelSchema);

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

/**
 * Gets the list of levels created in the database.
 * @param callback(levelList) - Function to call when the query finishes
 */
function getLevelSequence(callback) {
    Level.find({}, 'number', { sort: { number: 1 } }, function (error, levelList) {
        if (!error) callback(levelList);
        else callback({});
    });
}
exports.getLevelSequence = getLevelSequence;

/**
 * Adds a brand new level to the database
 * @param callback(number) - Function to call when the query finishes
 */
function addLevel(callback) {
    Level.count({}, function(error, amount) {
        if (!error) {
            level = Level({
                number: amount+1,
                map: {'0': 0 }
            });
            level.save(function (error, level) {callback(level);});
        } else callback({});
    });

}
exports.addLevel = addLevel;

/**
 * Modifies an existent level.
 * @param n - Level to update
 * @param m - Map to update
 * @param callback(number) - Function to call when the query finishes
 */
function updateLevel(n, m, callback) {
    Level.findOne({number: n}, function(error, level) {
        for (var i in m) {
            if (m[i] === 0) {
                delete level.map[i];
            } else {
                level.map[i] = m[i];
            }
        }
        Level.update({number: n}, { $set: {map: level.map}}, function(error) {
            if (!error) callback(true);
            else callback(false);
        });
    });
    
}
exports.updateLevel = updateLevel;

/**
 * Returns an existent level.
 * @param level - Level to modify
 * @param callback(number) - Function to call when the query finishes
 */
function getLevel(number, callback) {
    Level.findOne({number: number}, function(error, level) {
        if (!error) {
            if (level) callback(level);
            else callback({});
        }
    });
}
exports.getLevel = getLevel;

/**
 * Deletes an existent level.
 * @param level - Level to delete
 * @param callback(ok) - Function to call when the query finishes
 */
function deleteLevel(number, callback) {
    Level.findOneAndRemove({number: number}, function(error) {
        if (!error) {
            console.log("buscar y borrar");
            Level.find({number: {$gt: number}}, function(error, toUpdate) {
                console.log("bucle");
                for (i=0; i<toUpdate.length; i++) {
                    console.log(i);
                    Level.update({number: toUpdate[i].number}, { $set: {number: toUpdate[i].number-1}}, function() {
                        return;
                    });
                }
                callback({ok: true});
            });
        } else callback({ok: false});
    });
}
exports.deleteLevel = deleteLevel;

/**
 * Moves an existent level.
 * @param from - Where do we move the level.
 * @param to - To where do whe move it.
 * @param callback(ok) - Function to call when the query finishes
 */
function moveLevel(from, to, callback) {
    Level.update({number: from}, { $set: {number: -1}}, function() {
        Level.update({number: to}, { $set: {number: from}}, function(error) {
            if (!error) {
                Level.update({number: -1}, { $set: {number: to}}, function(error) {
                    if (error) {
                        // Revert changes
                        Level.update({number: from}, { $set: {number: to}}, function() {
                            Level.update({number: -1}, { $set: {number: from}}, function() {
                                callback({ok: false});
                            });
                        });
                    }
                    else callback({ok: true});
                });
            } else {
                // Revert changes
                Level.update({number: -1}, { $set: {number: from}}, function() {
                    callback({ok: false});
                });
            }
        });
    });
}
exports.moveLevel = moveLevel;