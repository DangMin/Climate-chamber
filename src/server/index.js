const {Server} = require('hapi')
const Vision = require('vision')
const Inert = require('inert')
const Nunjucks = require('nunjucks')

const Webpack = require('webpack')
const Dashboard = require('webpack-dashboard/plugin')

const Socket = require('socket.io')

const wpConfig = require('../../webpack.config')
const Config = require('../config')

const { db } = require('./db')
const { endpoints } = require('./routes')

const server = new Server()
server.connection(Config.server)

const io = Socket(server.listener)
const Serialport = require('serialport')

const compiler = Webpack(wpConfig)
compiler.apply(new Dashboard())

const host = Config.server.host
const port = Config.server.port

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  host, port, noInfo: true,
  historyApiFallback: true,
  publicPath: wpConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

const serialport = new Serialport(Config.defaultPort, Config.serialport(Serialport))

io.on('connection', socket => {
  console.log(`Socket is open on ${server.info.port}`)
  socket.setMaxListeners(0)
  socket.on('req-connect', _ => {
    console.log('request open')
    if (!serialport.isOpen()) {
      serialport.open(err => {
        if (err) {
          socket.emit('serial-status', { err: true, message: 'Cannot open serialport', status: serialport.isOpen() })
        } else {
          socket.emit('serial-status', { err: false, status: serialport.isOpen() })
        }
      })
    }
  })
  socket.on('req-disconnect', _ => {
    if (serialport.isOpen()) {
      serialport.close(err => {
        if (err) {
          socket.emit('serial-status', { err: true, message: 'Cannot close serialport', status: serialport.isOpen() })
        }
        socket.emit('serial-status', { err: false, status: serialport.isOpen() })

      })
    }
  })
})

server.ext('onRequest', (request, reply) => {
  devMiddleware(request.raw.req, request.raw.res, err => {
    if (err) {
      return reply(err)
    }

    return reply.continue()
  })
})

server.ext('onRequest', (request, reply) => {
  hotMiddleware(request.raw.req, request.raw.res, err => {
    if (err)
      return reply(err)

    return reply.continue()
  })
})

server.register([Config.good, Vision, Inert], err => {
  if (err) {
    throw err
  }

  // Register routes
  server.route(endpoints)

  // Nunjucks - view manager
  server.views( Config.engines(Nunjucks, __dirname))
})

server.start(err => {
  if (err) {
    throw err
  }

  console.log(`Server is running on ${server.info.uri}`)
})
