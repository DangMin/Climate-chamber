import m from 'mithril'
import io from 'socket.io-client'
import Indicator from '../indicator'
import Error from '../indicators/errorIndicator'

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
      if (data.error) {
        // Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
        SerialState.state = data.status
        m.redraw()
      } else {
        SerialState.state = data.status
        m.redraw()
      }
    })
  })()
}

socket.on('connection-timeout', data => {
  console.log(data)
  if (data.error) {
    //Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
    SerialState.state = data.status
    m.redraw()
  } else {
    SerialState.state = data.status
    m.redraw()
  }
})

export default SerialState
