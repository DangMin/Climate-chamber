const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const UserModel = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true }
}, {
  timestamps: true
})

const ProgramModel = new Schema({
  name: { type: String, required: true, unique: true },
  cycles: { type: Number, required: true }
}, {
  timestamps: true
})

const StepModel = new Schema({
  order: { type: Number },
  program_id: { type: Schema.Types.ObjectId, required: true },
  temperature: { type: Number, default: 0 },
  humidity: { type: Number, default: 0 },
  time: { type: String, default: '00:00' },
  wait: {
    option: { type: Boolean, default: false },
    time: { type: String, default: '00:00' }
  },
  options: {
    opt_1: { type: Boolean, default: false },
    opt_2: { type: Boolean, default: false },
    opt_3: { type: Boolean, default: false }
  }
}, {
  timestamps: true
})

const program = Mongoose.model('program', ProgramModel)
const step = Mongoose.model('step', StepModel)
const user = Mongoose.model('user', UserModel)

module.exports = {
  Program: program,
  Step: step,
  User: user
}
