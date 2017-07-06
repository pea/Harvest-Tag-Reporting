'use strict'

const roundHours = (hour) => {
  return Math.ceil(hour / 0.25) * 0.25
}

module.exports = roundHours
