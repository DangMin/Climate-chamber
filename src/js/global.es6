// Internal functions
const switchTab = (activeId, activeClass) => {
  const target = document.getElementById(id)
  const siblings = target.parentNode.children
  Array.prototype.forEach.call(siblings, sibling => {
    sibling.classList.remove(activeClass)
  })
  target.classList.add(activeClass)
}

// Exported functions
const tabHandler = classname => {
  const targets = document.getElementsByClassName(classname)
  Array.prototype.forEach.call(targets, target => {
    target.addEventListener('click', switchTab.bind(null, target.dataset.tab, 'main_tabs--active'))
  })
}

export { tabHandler }
