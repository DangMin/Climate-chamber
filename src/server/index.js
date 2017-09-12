const {Server} = require('hapi')
const Vision = require('vision')
const Inert = require('inert')
const Nunjucks = require('nunjucks')

const Webpack = require('webpack')
const Dashboard = require('webpack-dashboard/plugin')

const Socket = require('socket.io')
const Serialport = require('serialport')

const Command = require('./modules/commands')
const Chamber = require('./modules/chamber')
const Controller = require('./modules/controller')

const wpConfig = require('../../webpack.config')
const Config = require('../config')

const { db } = require('./db')
const { endpoints } = require('./routes')
const { sendMsg } = require('./helpers')

const server = new Server()
server.connection(Config.server)

const io = Socket(server.listener, Config.socket.options)

module.exports.listener = server.listener

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
const emitter = require('./emitter')
const command = new Command()
const chamber = new Chamber()
const controller = new Controller(chamber, command)

let connectionCounter = 0
let connectionTimeout = null
let serialCheck = setInterval(_ => {
  if (serialport.isOpen()) {
    command.isConnected = true
  } else {
    command.isConnected = false
  }
}, 1000)

io.on('connection', socket => {
  console.log(`Socket is open on ${server.info.port}`)
  socket.setMaxListeners(Infinity)
  /* Block: Open - close serial connection */
  const listeners = {
    openSerial: callback => {
      if (!serialport.isOpen()) {
        serialport.open(err => {
          if (err) {
            callback({ error: true, message: 'Cannot open serialport', status: serialport.isOpen() })
          } else {
            const interval_1 = setInterval(_ => emitter.emit('get-chamber-info'), 1000)
            if (connectionTimeout == null) {
              connectionTimeout = setInterval( _ => {
                if (connectionCounter >= 5) {
                  emitter.emit('terminate-serial')
                  connectionCounter = 0
                  clearInterval(connectionTimeout)
                  connectionTimeout = null
                } else {
                  ++connectionCounter
                }
              }, 1000)
            }

            callback({ error: false, message: null, status: serialport.isOpen() })
          }
        })
      } else {
        callback ({ error: false, message: null, status: serialport.isOpen() })
      }
    },
    closeSerial: callback => {
      if (serialport.isOpen()) {
        serialport.close(err => {
          if (err) {
            callback({ error: true, message: 'Cannot close serialport', status: serialport.isOpen() })
          } else {
            callback({ error: false, message: null, status: serialport.isOpen() })
          }
        })
      } else {
        callback({ error: false, message: null, status: serialport.isOpen() })
      }
    },
    disconnect: _ => socket.disconnect(true),
    requestDisplay: _ => controller.fetch(),
    startProgram: params => setImmediate(_ => {
      if (command.isConnected) {
        controller.initiate(params.program, params.steps, params.pids)
      } else {
        emitter.emit('terminate-serial', { signal: 'err', data:{ msg: 'Serialport is not connected.' } })
      }
    }),
    stopProgram: params => controller.reset(params.program),
    onData: data => {
      connectionCounter = 0
      if (command.ready && serialport.isOpen()) {
        if (data[0] == 0x06) {
          sendMsg(serialport, command.command.iy())
        } else {
          switch (data[2]) {
          case 0x41: {
            socket.emit('chamber-info', command.read(data))
            chamber.setValue(command.read(data))
            sendMsg(serialport, command.command.br())
            break
          }
          case 0x42: {
            command.idle ? sendMsg(serialport, command.command.idle()) : sendMsg(serialport, command.command.o())
            emitter.emit('control', { signal: 'command-params', data: command.output() })
            command.setReady(false)
            break
          }
          case 0x49: {
            sendMsg(serialport, command.command.aq())
            break
          }
          }
        }
      }
    },
  }

  const eventListeners = {
    controlHandler: data => socket.emit(data.signal, data.data),
    programHandler: data => socket.emit(data.signal, data.data),
    terminateSerial: _ => {
      if (serialport.isOpen()) {
        serialport.close(err => {
          if (err) {
            emitter.emit('control', {
              signal: 'connection-timeout',
              data:{ error: true, status: serialport.isOpen(), message: 'Connection timeout but cannot close serial connection.'}})
          } else {
            emitter.emit('control', {
              signal: 'connection-timeout',
              data: { error: false, status: serialport.isOpen(), message: 'Connection timeout' }
            })
          }
        })
      }
    },
  }

  socket.on('req-connect', cb => {
    listeners.openSerial(cb)
  })
  socket.on('req-disconnect', cb => {
    listeners.closeSerial(cb)
  })
  socket.on('disconnect-socket', _ => {
    listeners.disconnect()
  })
  /* Endblock */

  /* Block: Controller */
  socket.on('req-display', _ => {
    listeners.requestDisplay()
  })
  socket.on('req-startProgram', params => {
    listeners.startProgram(params)
  })
  socket.on('req-stopProgram', params => {
    listeners.stopProgram(params)
  })
  /* Endblock */

  /* Block: Read from/ reply to serial connection */
  serialport.on('data', data => {
    listeners.onData(data)
  })
  /* Endblock */

  emitter.on('control', data => {
    eventListeners.controlHandler(data)
  })

  emitter.on('program', msg => {
    eventListeners.programHandler(msg)
  })

  emitter.on('terminate-serial', _ => {
    eventListeners.terminateSerial()
  })
})

emitter.on('get-chamber-info', _ => {
  //cmd.setReady()
  command.setReady(true)
  sendMsg(serialport, command.command.br())
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
