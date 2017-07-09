const Joi = require('joi')
const Boom = require('boom')
const Models = require('./models')

exports.index = (request, reply) => {
  reply.view('index')
}

exports.getPrograms = (request, reply) => {
  Models.Program.find({}, (err, programs) => {
    if (err) {
      reply(Boom.badImplementation(err))
    }
    reply(programs)
  })
}

exports.addProgram = (request, reply) => {
  const payload = request.payload
  Models.Program.create(request.payload, err => {
    let res = {}
    if (err) {
      res = { success: false, err: err }
    } else {
      res = { success: true }
    }

    reply(res)
  })
}

exports.removeProgram = (request, reply) => {
  let res = { error: null }
  const payload = request.payload
  Models.Program.remove(payload, err => {
    if (err) {
      res.error = err
      reply(err)
    }

    reply(res)
  })
}

exports.getProgramById = (request, reply) => {
  let res = { error: null }
  Models.Program.findOne({ _id: request.params.programId }, (err, program) => {
    if (!err && program) {
      Models.Step.find({ program_id: request.params.programId }, (err, steps) => {
        if (!err) {
          reply({ success: true, program: program, steps: steps })
        } else {
          reply({ success: false, error: err })
        }
      })
    } else if (err) {
      reply({ success: false, error: err })
    } else if (!program) {
      reply({ success: false, error: 'Cannot find program' })
    }
  })
}

exports.editProgram = (request, reply) => {
  const payload = request.payload
  Models.Program.update({ _id: payload._id }, { name: payload.name, cycles: payload.cycles }, error => {
    if (error) {
      reply ({ success: false, error: error })
    }
    reply({ success: true, error: null })
  })
}

exports.getStepById = (request, reply) => {
  const params = request.params
  Models.Step.findOne({ _id: params._id }, (err, step) => {
    if (!err && step) {
      reply({ success: true, step: step })
    } else if (err) {
      reply({ success: false, error: err })
    } else if (step) {
      reply({ success: false, error: 'Cannot find step.' })
    }
  })
}
