import m from 'mithril'
import io from 'socket.io-client'

const socket = io('http://localhost:8080')

let SerialState = {
  state: false,
  reqConnection: () => {
    if (!SerialState.state) {
      socket.emit('req-connect', data => {
        if (data.error) {
          console.log(`Error: ${data.message}`)
        } else {
          SerialState.state = data.state
        }
      })
    }
  },
  disconnect: () => {
    if (SerialState.state) {
      socket.emit('req-disconnect', data => {
        if (data.error) {
          console.log(`Error: ${data.message}`)
        } else {
          SerialState.state = data.state
        }
      })
    }
  }
}

socket.on('serial-state', data => {
  if (data.error) {
    console.log(`Error: ${data.message}`)
  } else {
    SerialState.state = data.state
  }

  m.redraw()
})

export default SerialState
