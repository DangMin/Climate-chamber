const handlers = require('./handlers')

exports.endpoints = [
  { method: 'GET', path: '/', handler: handlers.index },
  { method: 'GET', path: '/public/{param*}', handler: { directory: { path: 'public', listing: true } } },

  { method: 'GET', path: '/programs', handler: handlers.getPrograms },
  { method: 'GET', path: '/programs/{programId}', handler: handlers.getProgramById },
  { method: 'POST', path: '/programs/add', handler: handlers.addProgram },
  { method: 'POST', path: '/programs/edit', handler: handlers.editProgram },
  { method: 'DELETE', path: '/programs/remove', handler: handlers.removeProgram },

  { method: 'GET', path: '/steps/getOne/{_id}', handler: handlers.getStepById },
  { method: 'GET', path: '/steps/{programId}', handler: handlers.getSteps },
  { method: 'POST', path: '/steps/add', handler: handlers.addStep },
  { method: 'POST', path: '/steps/edit', handler: handlers.editStep },
  { method: 'DELETE', path: '/steps/remove', handler: handlers.removeStep },

  { method: 'GET', path: '/pids', handler: handlers.getPids },
  { method: 'GET', path: '/pids/{_id}-{type}', handler: handlers.getPidById },
  { method: 'GET', path: '/pids/default', handler: handlers.getDefaultPid },
  { method: 'POST', path: '/pids/add', handler: handlers.addPid },
  { method: 'POST', path: '/pids/set-default', handler: handlers.setDefaultPid },
  { method: 'DELETE', path: '/pids/remove', handler: handlers.removePid },

  { method: 'GET', path: '/history', handler: handlers.getHistories },
  { method: 'GET', path: '/history/{_id}', handler: handlers.getHistoryById },
]
