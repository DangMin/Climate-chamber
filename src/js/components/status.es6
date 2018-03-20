import m from 'mithril'
import Status from './models/serialState'

const c = {
  oninit: _ => Status.checkStatus(),
  view: _ => m('.status-box', [
      m('.status-box__state', [
        m('p', [
          m('span', 'Serial connection: '),
          m('i.fa.fa-2x', { class: Status.state ? 'fa-check-circle' : 'fa-times-circle'})
        ])
      ]),
      m('.status-box__control', [
        !Status.state ?
          m('button[type=button]', { onclick: Status.reqConnection }, 'Connect') :
          m('button[type=button]', { onclick: Status.disconnect }, 'Disconnect')
      ])
  ])
}

export default c
