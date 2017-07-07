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
    if (err) {
      res.error = err
      reply(res)
    } else if (!program) {
      res.error = 'Cannot find program.'
      reply(res)
    } else {
      reply(program)
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
