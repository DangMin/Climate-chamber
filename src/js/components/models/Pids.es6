import m from 'mithril'
import { filter, find } from 'lodash'
import { serialize } from '../../global'

const model = {
  form: {
    temp: false,
    humid: false
  },
  list: {
    temperature: [],
    humidity: []
  },
  current: {
    temperature: null,
    humidity: null
  },
  default: {
    temperature: null,
    humidity: null,
  },

  activateForm: (type, event) => {
    if (!model.form[type]) {
      model.form[type] = true
    }
  },
  cancelForm: (type, event) => {
    if (model.form[type]) {
      model.form[type] = false
    }
  },
  fetch: _ => {
    m.request({ method: 'GET', url: '/pids', }).then(rslt => {
      model.list.temperature = filter(rslt.pids, item => item.type == 'temperature')
      model.list.humidity = filter(rslt.pids, item => item.type == 'humidity')
      model.default.temperature = find(rslt.pids, { 'type': 'temperature', 'default': true })
      model.default.humidity = find(rslt.pids, { 'type': 'humidity', 'default': true })
    })
  },
  addPid: (formId, e) => {
    e.preventDefault()
    const form = document.getElementById(formId)
    const data = serialize(form)

    m.request({ method: 'POST', url: '/pids/add', data: data }).then(rslt => {
      model.resetForm()
      model.fetch()
    })
  },
  resetForm: _ => {
    model.form.temp = false,
    model.form.humid = false
  },
  choosePid: e => {
    const dataset = e.currentTarget.dataset
    const chosen = find(model.list[dataset.type], {'_id': dataset.id})
    if (!model.current[dataset.type])
      model.current[dataset.type] = chosen
    else
      model.current[dataset.type] = chosen._id === model.current[dataset.type]._id ? null : chosen

    console.log(model.current[dataset.type])
  },
  setDefault: (type, e) => {
    if (model.current[type]) {
      m.request({ method: 'POST', url: '/pids/set-default', data: { _id: model.current[type]._id, type: model.current[type].type }}).then(rslt => {
        if (rslt.success) {
          model.fetch()
        } else {
          console.log(rslt.error)
        }
      })
    }
  },
  removePid: (type, e) => {
    e.preventDefault()
    if (model.current[type]) {
      m.request({ method: 'DELETE', url: '/pids/remove', data: { _id: model.current[type]._id, type: model.current[type].type } }).then(rslt => {
        if (rslt.success) {
          model.fetch()
        } else {
          console.log(rslt.error)
        }
      })
    }
  },

  unsetDefault: (type, e) => {
    e.preventDefault()
    m.request({ method: 'POST', url: '/pids/unset-default', data: { _id: model.current[type]._id, type: model.current[type].type } }).then(rslt => {
      if(rslt.success) {
        model.fetch()
      } else {
        Indicator.setTitle(Error.title()).setBody(Error.body(rslt.error)).show()
      }
    })
  }
}

export default model
