'use strict'

const roundHours = require('../helpers/roundHours.js')

const generateReport = (data, rounding, roundTo, harvest) => {
  return new Promise(function(resolve, reject) {
    var report = [];
    var itemsProcessed = 0;
    report.push({
      tag: data[0].tag,
      hours: roundHours(data[0].hours, rounding, roundTo)
    })
    data.splice(0, 1)
    data.forEach((entry) => {
      var exists = false
      report.forEach((item, index) => {
        if (item.tag == entry.tag && itemsProcessed < data.length) {
          report[index].hours += roundHours(entry.hours, rounding, roundTo)
          exists = true
        }
      })
      if (!exists) {
        report.push({
          tag: entry.tag,
          hours: roundHours(entry.hours, rounding, roundTo)
        })
      }
      itemsProcessed++;
      if(itemsProcessed === data.length) {
        resolve(report)
      }
    })
  });
}

module.exports = generateReport
