'use strict'

const moment = require('moment');
const Harvest = require('harvest');
const prompt = require('prompt');
const getUser = require('./api/getUser.js')
const getReport = require('./api/getReport.js')
const getAllProjects = require('./api/getAllProjects.js')
const filterReport = require('./helpers/filterReport.js')
const generateReport = require('./helpers/generateReport.js')
const displayReport = require('./helpers/displayReport.js')

prompt.start();

var configSchema = {
  properties: {
    email: {
      default: ''
    },
    password: {
      hidden: true,
      default: ''
    },
    subdomain: {
      default: ''
    },
    fromDate: {
      default: moment().weekday(-6).format('D MMM YY')
    },
    toDate: {
      default: moment().weekday(0).format('D MMM YY')
    },
    tag: {
      description: 'Tag to group by (1,2 or 3)',
      default: 1
    },
    rounding: {
      description: 'round, roundup or none',
      default: 'roundup'
    },
    roundTo: {
      description: 'Minutes to round to if rounding not disabled',
      default: '15'
    }
  }
};

prompt.get(configSchema, (err, config) => {
  var harvest = new Harvest({
    subdomain: config.subdomain,
    email: config.email,
    password: config.password
  });

  var fromDate = moment(config.fromDate, 'D MMM YY').format('YYYYMMDD');
  var toDate = moment(config.toDate, 'D MMM YY').format('YYYYMMDD');

  getUser(config.email, harvest)
    .then((user) => { return getReport(user.id, config.fromDate, config.toDate, harvest) })
    .then((data) => { return filterReport(data, config.tag-=1, harvest) })
    .then((results) => { return generateReport(results, config.rounding, config.roundTo) })
    .then((results) => { return displayReport(results, config.fromDate, config.toDate) })
    .catch((err) => { throw err })
});
