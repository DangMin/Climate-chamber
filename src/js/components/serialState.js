import m from 'mithril'
import io from 'socket.io-client'

const c = {
  state: false,
  view: () => {
    return m('.row', [
      m('.col-md-8', [
        m('p', `Serial connection state: ${c.state}`)
      ]),
      m('.col-md-4 .status-bar__right', [
        m('button', 'Connect')
      ]),
    ])
  }
}

export default c
