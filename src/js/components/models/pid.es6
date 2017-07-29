import m from 'mithril'

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
  }
}

export default model
