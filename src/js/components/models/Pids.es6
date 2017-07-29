import m from 'mithril'
import { filter } from 'lodash'
import { serialize } from '../../global'

const model = {
  form: {
    temp: false,
    humid: false
  },
  list: {
    temp: [],
    humid: []
  },
  current: {
    temperature: null,
    humidity: null
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
      console.log(rslt.pids)
      model.list.temp = filter(rslt.pids, item => item.type == 'temperature')
      model.list.humid = filter(rslt.pids, item => item.type == 'humidity')
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
    const target = e.currentTarget
    m.request({ method: 'GET', url: `/pids/${target.dataset.id}-${target.dataset.type}` }).then(rslt => {
      if (rslt.error) {
        console.log(rslt.error)
      }

      model.current[rslt.pid.type] = rslt.pid
      console.log(model.current[rslt.pid.type])
    })
  },
  setDefault: () => {}
}

export default model
