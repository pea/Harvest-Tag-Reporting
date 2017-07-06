'use strict'

const getAllProjects = require('./getAllProjects.js')

const getProject = (id, harvest) => {
  return new Promise((resolve, reject) => {
    getAllProjects(harvest)
      .then((projects) => {
        projects.forEach((project) => {
            if (project.project.id == id) {
                resolve(project)
            }
        })
      })
      .catch((err) => { throw err })
  });
}

module.exports = getProject
