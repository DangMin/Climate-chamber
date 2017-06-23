const handler = require('./handler')

module.exports = server => {
  server.route({
    method: 'GET',
    path: '/',
    handler: handler.index
  })
}
