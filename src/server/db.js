const Mongoose = require('mongoose')
const Config = require('../config')

Mongoose.connect(`mongodb://${Config.database.host}:
  ${Config.database.port}/${Config.database.db}`)
const db = Mongoose.connection

db.on('error', console.error.bind(console, 'Database connection error!'))
db.once('open', _ => {
  console.log('Database connection is successfully established!')
})

exports.Mongoose = Mongoose
exports.db = db
