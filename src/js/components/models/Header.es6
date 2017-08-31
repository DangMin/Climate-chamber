import m from 'mithril'
import Indicator from '../indicator'
import * as Error from '../indicators/errorIndicator'
import { socket } from '../../global'

let c = {
  state: false,
  reqConnection: () => {
    if (!c.state) {
      socket.emit('req-connect', data => {
        if (data.error) {
          Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
        } else {
          c.state = data.status
          m.redraw()
        }
      })
    }
  },
  disconnect: () => {
    if (c.state) {
      socket.emit('req-disconnect', data => {
        if (data.error) {
          Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
        } else {
          c.state = data.status
          m.redraw()
        }
      })
    }
  }
}

socket.on('initializeSerial', data => {
  console.log(data)
  c.state = data.state
  m.redraw()
})

socket.on('connection-timeout', data => {
  if (data.error) {
    Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
    c.state = data.status
    m.redraw()
  } else {
    alert('connection close')
    c.state = data.status
    m.redraw()
  }
})

export default c
