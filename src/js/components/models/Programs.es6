import m from 'mithril'
import { serialize } from '../../global'

const Programs = {
  list: [],
  stepList: [],
  isPrgmForm: false,
  currentProgram: null,
  formType: null,

  chooseProgram: (id, e) => {
    m.request({
      method: 'GET',
      url: `/program/${id}`
    }).then(result => {
      if (!result.success) {
        console.log(result.error)
      } else {
        Programs.currentProgram = result.program
        Programs.stepList = result.steps
        Programs.resetForm()
      }
    })
  },
  fetch: () => {
    m.request({
      method: 'GET',
      url: '/programs',
    }).then(result => {
      Programs.list = result
      console.log(Programs.isStepForm)
    })
  },
  fetchSteps: (prgm_id) => {
  },
  addFormSignal: (_id, e) => {
    if (!_id) {
      Programs.currentProgram = null
    }
    if (!Programs.isPrgmForm) {
      Programs.isPrgmForm = true
    }
  },
  rmPrgm: (id, e) => {
    m.request({
      method: 'DELETE',
      url: '/remove-program',
      data: { _id: Programs.currentProgram._id }
    }).then(result => {
      if (result.error) {
        console.log(result.error)
      } else {
        setTimeout(Programs.fetch, 1000)
      }
    })
  },
  cancelForm: event => {
    event.preventDefault()
    if (Programs.isPrgmForm) {
      Programs.isPrgmForm = false
    }
  },
  editProgram: event => {
    event.preventDefault()
    const data = serialize(document.getElementById('form-program-js'))
    m.request({
      method: 'POST',
      url: '/edit-program',
      data: data
    }).then(result => {
      if (result.error) {
        console.log(result.error)
      }
      Programs.fetch()
      Programs.isPrgmForm = false
    })
  },
  addProgram: event => {
    event.preventDefault()
    const form = document.getElementById('form-program-js')
    const data = serialize(form)
    m.request({
      method: 'POST',
      url: '/add-program',
      data: data
    }).then(rslt => {
      if (rslt.success) {
        Programs.fetch()
        Programs.isPrgmForm = false
      }
    })
  },

  isStepForm: false,
  stepFormType: null,
  currentStep: {},
  addStepForm: (_id, e) => {
    e.preventDefault()
    if (!Programs.isStepForm) {
      Programs.isStepForm = true
    }
    if (_id) {
      m.request({ method: 'GET', url: `/step/${_id}` }).then(result => {
        if (result.success) {
          Programs.currentStep = result.step
        } else {
          console.log(result.error)
        }
      })
    }
  },
  cancelStepForm: _ => {
    if (Programs.isStepForm) {
      Programs.isStepForm = false
    }
  },
  addStep: e => {
    e.preventDefault()
    const data = serialize(document.getElementById('step-form-js'))
    m.request({ method: 'POST', url: '/add-step', data: data }).then(result => {
      if (result.success) {
        Programs.fetchStep(data.program_id)
      } else {
        console.log(result.error)
      }
    })
  },
  fetchStep: id => {
    console.log('fetch step')
    m.request({ method: 'GET', url: `/steps/${id}` }).then(result => {
      if (result.success) {
        Programs.stepList = result.steps
        Programs.isStepForm = false
      } else {
        console.log(result.error)
      }
    })
  },
  removeStep: (id, event) => {
    m.request({ method: 'DELETE', url: '/remove-step', data: {_id: id} }).then(result => {
      if (result.success) {
        Programs.fetchStep(Programs.currentProgram._id)
      } else {
        console.log(result.error)
      }
    })
  },
  editStep: (id, event) => {

  },

  resetForm: _ => {
    Programs.isStepForm = false
    Programs.isPrgmForm = false
    Programs.currentStep = null
  }
}

export default Programs
