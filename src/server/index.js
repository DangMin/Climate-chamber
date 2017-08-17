const {Server} = require('hapi')
const Vision = require('vision')
const Inert = require('inert')
const Nunjucks = require('nunjucks')

const Webpack = require('webpack')
const Dashboard = require('webpack-dashboard/plugin')

const Socket = require('socket.io')
const EventEmitter = require('events')
const ControlCommands = require('./modules/control-commands')
const Chamber = require('./modules/chamber')
const Controller = require('./modules/controller')

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
const emitter = new EventEmitter()
const cmd = new ControlCommands()
const chamber = new Chamber()
const controller = new Controller()
const { sendMsg } = require('./helpers')

const state = {
  connected: false
}

io.on('connection', socket => {
  console.log(`Socket is open on ${server.info.port}`)
  socket.setMaxListeners(0)
  /* Block: Open - close serial connection */
  socket.on('req-connect', cb => {
    if (!serialport.isOpen()) {
      serialport.open(err => {
        if (err) {
          cb({ error: true, message: 'Cannot open serialport', status: serialport.isOpen() })
        } else {
          cb({ error: false, state: serialport.isOpen() })
          state.connected = true
          const interval_1 = setInterval(_ => emitter.emit('get-chamber-info'), 1000)
        }
      })
    } else {
      cb({ error: false, state: serialport.isOpen() })
      const interval_1 = setInterval(_ => emitter.emit('get-chamber-info'), 1000)
    }
  })
  socket.on('req-disconnect', _ => {
    if (serialport.isOpen()) {
      serialport.close(err => {
        if (err) {
          cb({ err: true, message: 'Cannot close serialport', status: serialport.isOpen() })
        } else {
          state.connected = false
          cb({ err: false, status: serialport.isOpen() })
        }
      })
    }
  })
  socket.on('disconnect-socket', _ => {
    socket.disconnect(true)
  })
  /* Endblock */

  /* Block: Controller */
  socket.on('req-startProgram', params => {
    controller.init(params.program, params.steps)
  })
  /* Endblock */

  /* Block: Read from/ reply to serial connection */
  serialport.on('data', data => {
    if (cmd.ready && serialport.isOpen()) {
      if (data[0] == 0x06) {
        sendMsg(serialport, cmd.createCmd.iy())
      } else {
        switch (data[2]) {
        case 0x41: {
          socket.emit('chamber-info', cmd.read(data))
          chamber.setValue(cmd.read(data))
          sendMsg(serialport, cmd.createCmd.br())
          break
        }
        case 0x42: {
          sendMsg(serialport, cmd.createCmd.o())
          cmd.unsetReady()
          break
        }
        case 0x49: {
          sendMsg(serialport, cmd.createCmd.aq())
          break
        }
        }
      }
    }
  })

  serialport.on('close', err => {
    if (err) {
      socket.emit('serial-state', { error: true, message: 'Error on closing serial port.', state: serialport.isOpen() })
    } else {
      socket.emit('serial-state', { error: false, state: serialport.isOpen() })
    }
  })
  /* Endblock */
})

emitter.on('get-chamber-info', _ => {
  cmd.setReady()
  sendMsg(serialport, cmd.createCmd.br())
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
