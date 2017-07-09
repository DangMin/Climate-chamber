// Internal functions
const switchTab = (activeId, activeClass) => {
  const target = document.getElementById(activeId)
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
    target.addEventListener('click', switchTab.bind(null, target.dataset.tab, 'container__tabs--active'))
  })
}

const serialize = element => {
  const inputs = element.getElementsByTagName('input')
  const obj = {}
  Array.prototype.forEach.call(inputs, input => {
    if (input.type == 'checkbox') {
      input.value = input.checked ? (input.value ? input.value : true) : false
    }
    if (input.name.match(/.*\[\]/g)) {
      const prop = new RegExp(/.*[^\[\]]/).exec(input.name)
      if (obj.hasOwnProperty(prop)) {
        obj[prop].push(input.value)
      } else {
        obj[prop] = [input.value]
      }
    } else {
      obj[input.name] = input.value
    }
  })
  return obj
}

const formatDate = date => {
  return `${date.getDay()}/${date.getMonth()}/${date.getYear()}`
}

export { tabHandler, serialize, formatDate }
