const PLAYBACK_STATUS = Object.freeze({
    NOT_READY: -1,
    IDLE: 0,
    PAUSED: 1,
    STOPPED: 2,
    READY: 3,
    PLAYING: 4,
    LOOPED: 5,
    SEEKING:6,
    TRANSITION: 7,
    SYNCHRONIZING: 8,
    UNKNOWN: 10,
    PANIC:1000
});

/* to be more useful in the future */
const FLAGS = Object.freeze({
    RED: 1 << 0,
    GREEN: 1 << 1,
    BLUE: 1 << 2,
    YELLOW: 1 << 2,

});

const SERVICE_TYPE = Object.freeze({
    CORE_SERVICE: 0,
    PLAYBACK_SERVICE: 1,
    NOTIFICATION_SERVICE: 2,
    INPUT_SERVICE: 3,
    OUTPUT_SERVICE: 4,
    GENERIC_SERVICE: 5,
    LIGHT_SERVICE: 6,
    DOMOTIC_SERVICE: 7
});

export {PLAYBACK_STATUS, FLAGS, SERVICE_TYPE};