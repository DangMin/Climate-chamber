import m from 'mithril'
import Indicator from '../indicator'
import * as Error from '../indicators/errorIndicator'
import { socket } from '../../global'

let SerialState = {
  state: false,
  reqConnection: () => {
    if (!SerialState.state) {
      socket.emit('req-connect', data => {
        if (data.error) {
          Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
        } else {
          SerialState.state = data.status
          m.redraw()
        }
      })
    }
  },
  disconnect: () => {
    if (SerialState.state) {
      socket.emit('req-disconnect', data => {
        if (data.error) {
          Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
        } else {
          SerialState.state = data.status
          m.redraw()
        }
      })
    }
  }
}

socket.on('connection-timeout', data => {
  if (data.error) {
    Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
    SerialState.state = data.status
    m.redraw()
  } else {
    SerialState.state = data.status
    m.redraw()
  }
})

export default SerialState
