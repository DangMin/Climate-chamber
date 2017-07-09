const handlers = require('./handlers')

exports.endpoints = [
  { method: 'GET', path: '/public/{param*}', handler: { directory: { path: 'public', listing: true } } },
  { method: 'GET', path: '/', handler: handlers.index },
  { method: 'GET', path: '/programs', handler: handlers.getPrograms },
  { method: 'GET', path: '/program/{programId}', handler: handlers.getProgramById },
  { method: 'POST', path: '/addProgram', handler: handlers.addProgram },
  { method: 'DELETE', path: '/remove-program', handler: handlers.removeProgram },
  { method: 'POST', path: '/edit-program', handler: handlers.editProgram },
  { method: 'GET', path: '/step/{_id}', handler: handlers.getStepById }
]
