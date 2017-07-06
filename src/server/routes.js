const handlers = require('./handlers')

exports.endpoints = [
  { method: 'GET', path: '/public/{param*}', handler: { directory: { path: 'public', listing: true } } },
  { method: 'GET', path: '/', handler: handlers.index },
  { method: 'GET', path: '/programs', handler: handlers.getPrograms },
  { method: 'POST', path: '/addProgram', handler: handlers.addProgram },
  { method: 'DELETE', path: '/remove-program', handler: handlers.removeProgram }
]
