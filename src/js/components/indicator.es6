import m from 'mithril'

const c = {
  visible: false,
  body: null,
  title: null,
  buttons: null,
  show: _ => {
    c.visible = true
    m.redraw()
  },
  view: _ => {
    if (!c.visible || !c.body || !c.title)
      return m('div')

    const footer = _ => {
      return m('.indicator__footer', c.buttons ? m('.button__group', c.buttons()) : '')
    }

    return m('.indicator', [
      m('.indicator__header', [
        m('.indicator__title', m('p', c.title)),
        m('.indicator__close', m('i.fa.fa-2x.fa-times-circle', { onclick: c.reset }))
      ]),
      m('.indicator__body.centered-text', [
        m('p', c.body)
      ]),
      footer()
    ])
  }
}

c.setBody = b => {
  c.body = b
  return c
}

c.setTitle = t => {
  c.title = t
  return c
}

c.setButtons = bt => {
  c.buttons = bt
  return c
}
c.reset = _ => {
  c.visible = false
  c.body = null
  c.title = null
  c.buttons = null
}

export default c
