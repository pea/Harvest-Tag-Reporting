'use strict'

const getAllProjects = (harvest) => {
  const Projects = harvest.projects
  return new Promise((resolve, reject) => {
    Projects.list({}, (err, projects) => {
        if (projects.statusCode != 200) {
            reject(projects.body.message)
        } else {
            resolve(projects.body)
        }
    })
  })
}

module.exports = getAllProjects
