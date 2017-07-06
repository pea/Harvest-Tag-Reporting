'use strict'

const getProject = require('../api/getProject.js')
const parseName = require('../helpers/parseName.js')

const filterReport = (report, tag, harvest) => {
  return new Promise(function(resolve, reject) {
    var results = []
    var itemsProcessed = 0
    report.forEach((entry, index) => {
      getProject(entry.day_entry.project_id, harvest)
        .then((project) => {
          if (typeof(project.project.name) !== 'undefined') {
            var projectName = parseName(project.project.name)
            if (projectName != false && typeof(projectName.tags[tag]) !== 'undefined') {
              results.push({
                tag: projectName.tags[tag],
                project_name: projectName.name,
                spent_at: entry.day_entry.spent_at,
                hours: entry.day_entry.hours
              })
            }
          } else {
            throw project
          }
          itemsProcessed++
          if(itemsProcessed === report.length) {
            resolve(results)
          }
        }, () => {
          throw 'Project not found'
        })
        .catch((err) => {
          throw err
        })
    })
  })
}

module.exports = filterReport
