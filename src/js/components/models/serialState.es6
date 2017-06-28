import m from 'mithril'
import io from 'socket.io-client'

const socket = io('http://localhost:8080')
let SerialState = {
  state: false,
  reqConnection: () => {
    if (!SerialState.state) {
      socket.emit('req-connect')
    }
  },
  disconnect: () => {
    if (SerialState.state) {
      socket.emit('req-disconnect')
    }
  },
  update: (() => {
    socket.on('serial-status', data => {
      console.log(data)
      if (data.err) {
        console.log(`Error: ${data.message}`)
      } else {
        console.log(`Message: ${data.message}`)
        SerialState.state = data.status
        m.redraw()
      }
    })
  })()
}

export default SerialState
