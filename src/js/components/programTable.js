import m from 'mithril'

const c = {
  view: () => {
    return m('.program-display', [
      m('div', [
        m('p.program-display__header', "Program:"),
        m('p.program-display__body', "program-name")
      ]),
      m('div', [
        m('p.program-display__header', "Cycles:"),
        m('p.program-display__body', "number-of-cycle")
      ]),
      m('div', [
        m('p.program-display__header', "Steps:"),
        m('p.program-display__body', "number-of-step")
      ]),
      m('div', [
        m('p.program-display__header', "Current step:"),
        m('p.program-display__body', "current-step")
      ]),
      m('div', [
        m('p.program-display__header', "Next step:"),
        m('p.program-display__body', "next-step")
      ]),
      m('div', [
        m('p.program-display__header', "Time remaining:"),
        m('p.program-display__body', "time-remaining")
      ])
    ])
  }
}

export default c
