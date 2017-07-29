const handlers = require('./handlers')

exports.endpoints = [
  { method: 'GET', path: '/public/{param*}', handler: { directory: { path: 'public', listing: true } } },
  { method: 'GET', path: '/', handler: handlers.index },
  { method: 'GET', path: '/programs', handler: handlers.getPrograms },
  { method: 'GET', path: '/program/{programId}', handler: handlers.getProgramById },
  { method: 'GET', path: '/step/{_id}', handler: handlers.getStepById },
  { method: 'GET', path: '/steps/{programId}', handler: handlers.getSteps },
  // Post method
  { method: 'POST', path: '/add-program', handler: handlers.addProgram },
  { method: 'POST', path: '/add-step', handler: handlers.addStep },
  { method: 'POST', path: '/edit-program', handler: handlers.editProgram },
  { method: 'POST', path: '/add-pid', handler: handlers.addPid },
  // Delete method
  { method: 'DELETE', path: '/remove-step', handler: handlers.removeStep },
  { method: 'DELETE', path: '/remove-program', handler: handlers.removeProgram },
]
