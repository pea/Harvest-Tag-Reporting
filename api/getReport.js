'use strict'

const getReport = (userId, fromDate, toDate, harvest) => {
  const Reports = harvest.reports
  return new Promise((resolve, reject) => {
    Reports.timeEntriesByUser(userId, {from: fromDate, to: toDate}, (err, report) => {
        if (report.statusCode != 200) {
            reject(report.body.message)
        } else {
            resolve(report.body)
        }
    })
  })
}

module.exports = getReport
