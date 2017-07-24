import m from 'mithril'
import defaultUser from '../../img/default-user.png'

const c = {
  view: _ => {
    return m('.user', [
      m('.user__header', [
        m('.user__options.dropdown', [
          m('button.btn.btn-primary.dropdown-toggle[type=button][data-toggle=dropdown]', m('i.fa.fa-bars.fa-2x')),
          m('ul.dropdown-menu', [
            m('li', m('a[href=#]', 'Option 1')),
            m('li', m('a[href=#]', 'Option 2'))
          ])
        ])
      ]),
      m('.user__profile--frame', [
        m(`img.user__profile--picture[src=${defaultUser}]`)
      ]),
      m('.user__profile--detail', [
        m('p', 'Username')
      ])
    ])
  }
}

export default c
