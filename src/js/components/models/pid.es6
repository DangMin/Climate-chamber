import m from 'mithril'
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
  addPid: (formId, e) => {
    e.preventDefault()
    const form = document.getElementById(formId)
    const data = serialize(form)

    m.request({ method: 'POST', url: '/add-pid', data: data }).then(rslt => {
      console.log(rslt)
    })
  }
}

export default model
