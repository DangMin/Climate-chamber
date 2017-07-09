const Joi = require('joi')
const Boom = require('boom')
const Models = require('./models')
const Mongoose = require('mongoose')
const { isEmpty } = require('lodash')

const ObjectId = Mongoose.Types.ObjectId

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
exports.addStep = (request, reply) => {
  const payload = request.payload
  Models.Step.where('program_id', payload.program_id).sort({ order: -1 }).limit(1).exec((err, step) => {
    if (err) {
      reply({ success: false, error: err })
    } else {
      let pl = {
        program_id: Mongoose.Types.ObjectId(payload.program_id),
        temperature: payload.temperature,
        humidity: payload.humidity,
        time: payload.time,
        wait: {
          option: payload.wait !== '' ? true : false,
          time: payload.wait !== '' ? payload.wait : '00:00'
        },
        options: payload.options
      }
      if (isEmpty(step)) {
        pl.order = 1
      } else {
        pl.order = step[0].order + 1
      }

      //reply({ payload: pl, step: step })

      Models.Step.create(pl, err => {
        if (err) {
          reply({ success: false, error: err })
        } else {
          reply({ success: true })
        }
      })
    }
  })
}
exports.getSteps = (request, reply) => {
  Models.Step.where('program_id', ObjectId(request.params.programId)).sort({ order: 1 }).exec( (err, steps) => {
    if (!err) {
      reply({ success: true, steps: steps })
    } else {
      reply({ success: false, error: err })
    }
  })
}
