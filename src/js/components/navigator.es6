import m from 'mithril'
import domready from 'domready'
import Programs from './programs'
import Pid from './pid'
import Graph from './graph'
import About from './about'

const links = [
  { route: '/', name: 'Programs', component: Programs },
  { route: '/pid', name: 'PID', component: Pid },
  { route: '/graph', name: 'Graph', component: Graph },
  { route: '/about', name: 'About', component: About }
]

const pick = e => {
  const target = e.currentTarget
  const siblings = target.parentNode.children
  Array.prototype.forEach.call(siblings, sibling => {
    sibling.classList.remove('navs--active')
  })
  target.classList.add('navs--active')
}

const c = {
  view: _ => {
    return m('.navs', [
      m('ul', [
        links.map(link => {
          return m('li', { onclick: pick.bind(event) }, [
            m(`a[href=#!${link.route}]`, link.name)
          ])
        })
      ])
    ])
  }
}

domready(_ => {
  const content = document.getElementById('js-content')

  m.route(content, '/', links.reduce((obj, link) => {
    obj[link.route] = link.component
    return obj
  }, {}))
})

export default c
