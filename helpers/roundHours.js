'use strict'

const roundHours = (hour, rounding, roundTo) => {
    switch(rounding) {
        case 'round':
            return Math.round(hour * (60/roundTo)) / (60/roundTo);
            break;
        case 'roundup':
            return Math.ceil(hour / (1/60*roundTo)) * (1/60*roundTo);
            break;
        default:
            return hour;
    }
}

module.exports = roundHours
