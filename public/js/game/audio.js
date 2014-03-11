// -----------------------------------------------------------------------------
// Name: /public/js/game/audio.js
// Author: Adam Barreiro
// Description: 
// Updated: 28-10-2013
// -----------------------------------------------------------------------------

define (function() {

var VOLUME = 0.5;
var ALERT =          ["alert", "assets/music/alert.mp3"];
var HIDDEN =         ["hidden", "assets/music/hidden.mp3"];
var LEVEL =          ["level", "assets/music/level.mp3"];
var CHEST =          ["chest", "assets/sfx/chest.mp3"];
var SHIELD =         ["shield", "assets/sfx/shield.mp3"];
var CLOCK =          ["clock", "assets/sfx/clock.mp3"];
var POWER =          ["power", "assets/sfx/power.mp3"];
var HEALTH =         ["health", "assets/sfx/health.mp3"];
var ATTACK =         ["attack", "assets/sfx/attack.mp3"];
var DAMAGE =         ["damage", "assets/sfx/damage.mp3"];
var ENEMY_DEATH =    ["enemy_death", "assets/sfx/enemy_death.mp3"];
var MONSTER_SCREAM = ["monster_scream", "assets/sfx/monster_scream.mp3"];

// -----------------------------------------------------------------------------
// Private
// -----------------------------------------------------------------------------
function supports() {
    return Crafty.audio.supports("mp3");
}

function playMusic(music) {
    if (supports()) {
        Crafty.audio.play(music, -1, VOLUME);
    }
}

function playEffect(effect) {
    if (supports()) {
        Crafty.audio.play(effect, 1, VOLUME);
    }
}

function stop(audio) {
    if (supports()) {
        Crafty.audio.stop(audio);
    }
}

// -----------------------------------------------------------------------------
// Public
// -----------------------------------------------------------------------------

return {
    /**
     * Adds the audio files to the Crafty engine
     */
    addAudio: function() {
        if (supports()) {
            Crafty.audio.add(ALERT[0], ALERT[1] );
            Crafty.audio.add(HIDDEN[0], HIDDEN[1]);
            Crafty.audio.add(LEVEL[0], LEVEL[1] );
            Crafty.audio.add(CHEST[0], CHEST[1] );
            Crafty.audio.add(SHIELD[0],SHIELD[1]);
            Crafty.audio.add(CLOCK[0], CLOCK[1] );
            Crafty.audio.add(POWER[0], POWER[1] );
            Crafty.audio.add(HEALTH[0],HEALTH[1]);
            Crafty.audio.add(ATTACK[0],ATTACK[1]);
            Crafty.audio.add(DAMAGE[0],DAMAGE[1]);
            Crafty.audio.add(ENEMY_DEATH[0], ENEMY_DEATH[1]);
            Crafty.audio.add(MONSTER_SCREAM[0],MONSTER_SCREAM[1]);
        }
    },
    /**
     * Returns an array with the audio files to load.
     */
    loadAudio: function() {
        if (supports()) {
            return [ALERT[1],HIDDEN[1],LEVEL[1],ATTACK[1],CHEST[1],CLOCK[1],
                    DAMAGE[1], ENEMY_DEATH[1], HEALTH[1], MONSTER_SCREAM[1],
                    POWER[1], SHIELD[1]];
        } else {
            alert("Tu navegador no soporta mp3. El audio se deshabilitará.");
            return [];
        }
    },
    /**
     * Music tracks
     */
    playLevel: function() {
        playMusic(LEVEL[0]);
    },
    stopLevel: function() {
        stop(LEVEL[0]);
    },
    playAlert: function() {
        playMusic(ALERT[0]);
    },
    stopAlert: function() {
        stop(ALERT[0]);
    },
    playHidden: function() {
        playMusic(HIDDEN[0]);
    },
    stopHidden: function() {
        stop(HIDDEN[0]);
    },
    /**
     * Effect sounds
     */
    playAttack: function() {
        playEffect(ATTACK[0]);
    },
    playChest: function() {
        playEffect(CHEST[0]);
    },
    playClock: function() {
        playEffect(CLOCK[0]);
    },
    playDamage: function() {
        playEffect(DAMAGE[0]);
    },
    playEnemyDeath: function() {
        playEffect(ENEMY_DEATH[0]);
    },
    playHealth: function() {
        playEffect(HEALTH[0]);
    },
    playMonsterScream: function() {
        playEffect(MONSTER_SCREAM[0]);
    },
    playPower: function() {
        playEffect(POWER[0]);
    },
    playShield: function() {
        playEffect(SHIELD[0]);
    },
};

});