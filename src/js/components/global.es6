// Internal functions
const switchTab = (activeId, activeClass) => {
  const target = document.getElementById(id)
  const siblings = target.parentNode.children
  siblings.forEach(sibling => {
    sibling.classList.remove(activeClass)
  })
  target.classList.add(activeClass)
}

// Exported functions
const tabHandler = classname => {
  const targets = document.getElementsByClassName(classname)
  targets.forEach(target => {
    target.addEventListener('click', switchTab.bind(null, target.dataset.tab, 'main_tabs--active'))
  })
}

export { tabHandler }
