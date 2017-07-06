'use strict'

const chalk = require('chalk')
const moment = require('moment')

const displayReport = (results, fromDate, toDate) => {
  // Header
  console.log('')
  console.log(chalk.gray(moment(fromDate, 'D MMM YY').format('DD/MM/YYYY') + ' - ' + moment(toDate, 'D MMM YY').format('DD/MM/YYYY')))
  console.log('')

  // Per Tag
  results.forEach((item) => {
    console.log(
      chalk.bold.yellow(item.tag) + ': ' + chalk.cyan(item.hours + ' hours')
    )
  })

  // Total
  var total = 0;
  results.forEach((item) => {
    total += item.hours
  })
  console.log('')
  console.log(
    chalk.bold.yellow('Total') + ": " + chalk.cyan(total + ' hours')
  )
  console.log('')
}

module.exports = displayReport