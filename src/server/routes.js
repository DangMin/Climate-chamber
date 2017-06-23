module.exports = (modules, server) => {
  modules.map(module => module.routes(server))

  server.route({
    method: 'GET',
    path: '/public/{params*}',
    handler: {
      directory: { path: 'public', listing:true }
    }
  })
}
