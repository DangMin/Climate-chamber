const Joi = require('joi')
const Boom = require('boom')
const Models = require('./models')
const Mongoose = require('mongoose')
const { isEmpty } = require('lodash')
const { timeFormat } = require('./helpers')

const ObjectId = Mongoose.Types.ObjectId

exports.index = (request, reply) => {
  reply.view('template')
}
exports.getPrograms = (request, reply) => {
  Models.Program.find({}, (err, programs) => {
    if (err) {
      reply(Boom.badImplementation(err))
    }
    reply({ success: true, programs: programs})
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
  const payload = request.payload
  Models.Step.remove({ program_id: payload._id }, err => {
    if (err) {
      reply({ success: false, error: err })
    }

    Models.Program.remove(payload, err => {
      if (err) {
        reply({ success: false, error: err})
      }

      reply({ success: true })
    })
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
        time: timeFormat(payload.time),
        wait: timeFormat(payload.wait),
        options: payload.options
      }
      if (isEmpty(step)) {
        pl.order = 1
      } else {
        pl.order = step[0].order + 1
      }

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
exports.removeStep = (request, reply) => {
  Models.Step.findOne({_id: ObjectId(request.payload._id) }, (err, step) => {
    if (!err && step) {
      Models.Step.update({ order: {$gt: step.order} }, { $inc: {order:-1} }, { multi: true }, (err, s) => {
        console.log(s)
        if (err) {
          reply({ success: false, error: err })
        }
      })
      step.remove()
      reply({ success: true })
    } else if (!step) {
      reply({ success: false, error: 'Cannot find step.' })
    } else if (err) {
      reply({ success: false, error: err })
    }
  })
}
exports.editStep = (request, reply) => {}

exports.getPids = (request, reply) => {
  Models.Pid.find({}, (err, pids) => {
    if (err) {
      reply({ success: false, error: err })
    }

    reply({ success: true, pids: pids })
  })
}
exports.addPid = (request, reply) => {
  const payload = request.payload
  console.log(typeof payload.default)

  if (payload.default === 'true') {
    console.log('here')
    Models.Pid.where('_id').ne(payload._id).where({ type: payload.type }).updateMany({ $set: { default: false }}, err =>{
      if (err) {
        reply({ success: false, error: err })
      }
    })
  }

  Models.Pid.create(payload, err => {
    reply( err ? { success: false, error: err } : { success: true })
  })
}

exports.getPidById = (request, reply) => {
  Models.Pid.findOne({ _id: request.params._id, type: request.params.type }, (err, pid) => {
    if (err) {
      reply({ success: false, error: err })
    }

    reply({ success: true, pid: pid })
  })
}

exports.setDefaultPid = (request, reply) => {
  Models.Pid
    .where('_id').ne(request.payload._id)
    .where({ type: request.payload.type }).updateMany({ $set: { default: false } }, err => {
      if (err) {
        reply({ success: false, error: err })
      }

      Models.Pid.where({ _id: request.payload._id, type: request.payload.type }).update({ default: true }, err => {
        if (err) {
          reply({ success: false, error: err })
        }

        reply({ success: true })
      })
    })
}

exports.removePid = (request, reply) => {
  Models.Pid.remove(request.payload, err => {
    if (err) {
      reply({ success: false, error: err })
    }

    reply({ success: true })
  })
}
