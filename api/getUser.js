'use strict'

const getUser = (userEmail, harvest) => {
  const User = harvest.users
  return new Promise((resolve, reject) => {
    User.list({}, (err, users) => {
      if (users.statusCode != 200) {
        reject(users.body.message)
      } else {
        users.body.forEach((user) => {
          if (user.user.email == userEmail) {
              resolve(user.user)
          }
        })
      }
    })
  })
}

module.exports = getUser
