const db = require('../database/postgres.connection')

const dbLogin = (data) => {
  return db.query(`SELECT * FROM users where user_name = $1`, [data.name])
}

module.exports = {
  dbLogin
}