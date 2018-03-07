const fs = require('fs')
const Joi = require('joi')
const Boom = require('boom')
const Models = require('./models')
const Mongoose = require('mongoose')
const { isEmpty, keyBy } = require('lodash')
const { timeFormat } = require('./helpers')

const ObjectId = Mongoose.Types.ObjectId

exports.index = (request, reply) => {
  reply.view('template')
}

/* ---------- Programs ---------- */
/* Method: GET - Get all programs */
exports.getPrograms = (request, reply) => {
  Models.Program.find({}, (err, programs) => {
    if (err) {
      reply(Boom.badImplementation(err))
    }
    reply({ success: true, programs: programs})
  })
}
/* Method: GET - Get program by ID */
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
/* Method: POST - Add new program */
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
/* Method: POST - Edit program */
exports.editProgram = (request, reply) => {
  const payload = request.payload
  Models.Program.update({ _id: payload._id }, { name: payload.name, cycles: payload.cycles }, error => {
    if (error) {
      reply ({ success: false, error: error })
    }
    reply({ success: true, error: null })
  })
}
/* Method: DELETE - remove a program */
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
/* ----------- End of Programs ---------- */

/* ----------- Steps ----------- */
/* Method: GET - Get all steps */
exports.getSteps = (request, reply) => {
  Models.Step.where('program_id', ObjectId(request.params.programId)).sort({ order: 1 }).exec( (err, steps) => {
    if (!err) {
      reply({ success: true, steps: steps })
    } else {
      reply({ success: false, error: err })
    }
  })
}
/* Method: GET - Get a step by ID */
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
/* Method: POST - Add a new step */
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
/* Method: POST - Edit a step */
exports.editStep = (request, reply) => {}
/* Method: DELETE - Remove a step */
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
/* ----------- End of Steps ----------- */

/* ----------- PIDs ----------- */
/* Method: GET - Get all PID parameters */
exports.getPids = (request, reply) => {
  Models.Pid.find({}, (err, pids) => {
    if (err) {
      reply({ success: false, error: err })
    }

    reply({ success: true, pids: pids })
  })
}
/* Method: GET - Get PID parameters by ID */
exports.getPidById = (request, reply) => {
  Models.Pid.findOne({ _id: request.params._id, type: request.params.type }, (err, pid) => {
    if (err) {
      reply({ success: false, error: err })
    }

    reply({ success: true, pid: pid })
  })
}
/* Method: GET - Get default PID parameters */
exports.getDefaultPid = (request, reply) => {
  Models.Pid.find({ default: true }).select('proportional integral derivative type').exec((err, pids) => {
    if (err) {
      reply({ success: false, error: err })
    }

    let rslt = keyBy(pids, 'type')
    rslt.success = true
    reply(rslt)
  })
}
/* Method: POST - Add new PID parameters */
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
/* Method: POST - Set PID parameters as default */
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
/* Method: POST - Unset PID parameters as default */
exports.unsetDefaultPid = (request, reply) => {
  Models.Pid.update(request.payload, { $set: { default: false } }, err => {
    if (err) {
      reply({ success: false, error: err })
    }

    reply({ success: true })
  })
}
/* Method: DELETE - remove a PID parameters */
exports.removePid = (request, reply) => {
  Models.Pid.remove(request.payload, err => {
    if (err) {
      reply({ success: false, error: err })
    }

    reply({ success: true })
  })
}
/* ----------- End of PIDs ----------- */

/* ----------- History ----------- */
/* Method: GET - Get all histories */
exports.getHistories = (request, reply) => {
  Models.History.find().populate('program_id').exec((error, histories) => {
    if (error) {
      reply({ success: false, error: error })
    } else {
      reply({ success: true, histories: histories })
    }
  })
}
/* Method: GET - Get history by ID */
exports.getHistoryById = (request, reply) => {
  Models.History.findOne({
    _id: request.params._id
  }, (err, history) => {
    if (err) {
      reply({ success: false, error: err })
    } else {
      let contents = []
      const filename = history._id+'.txt'
      fs.readFile(`datalog/${filename}`, 'utf8', (err, data) => {
        if (err || isEmpty(data)) {
          console.log(err)
          reply({ success: true, history: history, content: null, error: 'No data available!'})
        }
        else {
          sets = data.split('\n')
          sets.forEach((set, index) => {
            if (index ==  0)
              contents[index] = set.split(' - ')
            else
              contents[index] = set.split(' ')
          })

          isEmpty(contents) ?
            reply({ success: true, history: history, contents: null }) :
            reply({ success: true, history: history, contents: contents })
        }
      })
    }
  })
}
/* ----------- End of History ----------- */
