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
    if (err) {
      reply (Boom.badImplementation(err))
    }
  })
}
