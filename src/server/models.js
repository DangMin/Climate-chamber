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
  time: { type: String },
  wait: { type: String },
  options: { type: Array, default: [false, false, false]}
}, {
  timestamps: true
})

const PidModel = new Schema({
  default: { type: Boolean },
  type: { type: String, enum: ['temperature', 'humidity'] },
  proportional: { type: Number },
  integral: { type: Number },
  derivative: { type: Number }
})

const program = Mongoose.model('program', ProgramModel)
const step = Mongoose.model('step', StepModel)
const user = Mongoose.model('user', UserModel)
const pid = Mongoose.model('pid', PidModel)

module.exports = {
  Program: program,
  Step: step,
  User: user,
  Pid: pid
}
