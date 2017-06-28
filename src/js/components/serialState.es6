import m from 'mithril'
import SerialState from './models/serialState'

const c = {
  oninit: (vnode) => {
    SerialState.update
  },
  view: () => {
    return m('.row', [
      m('.col-md-8', [
        m('p', 'Serial connection state: ', [
          m('i.fa.fa-circle', { class: SerialState.state ? 'state--active' : 'state--unactive' })
        ])
      ]),
      m('.col-md-4 .status-bar__right', [
        SerialState.state ?
          m('button', { onclick: SerialState.disconnect }, 'Disconnect') :
          m('button', {onclick: SerialState.reqConnection}, 'Connect')
      ]),
    ])
  }
}

export default c
