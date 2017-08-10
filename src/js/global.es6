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

const formatDisplay = value => {
  let num = parseFloat(value)
  let str = ''
  if (num > 0) {
    str = num > 100 ? num.toString() : (num < 100 && num >= 10 ? `0${num.toString()}` : `00${num.toString()}`)
  } else if ( num < 0) {
    num = Math.abs(num)
    str = '-' + (num >= 10 && num < 100 ? `0${num.toString()}` : `00${num.toString()}`)
  }

  return str.length == 6 ? str : str+'0'
}

const setDigit = (value, digit = 2) => {
  if (value.toString().length < digit) {
    let str = ''
    for (let i = 0; i < digit-value.toString().length; ++i) {
      str+= '0'
    }
    str += value.toString()
    return str
  }
  return value.toString()
}

export { tabHandler, serialize, formatDate, formatDisplay, setDigit }
