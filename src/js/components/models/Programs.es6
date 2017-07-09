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
    })
  },
  fetchSteps: (prgm_id) => {
  },
  addFormSignal: (type, e) => {
    if (!Programs.isPrgmForm) {
      Programs.isPrgmForm = true
      Programs.formType = type
      console.log(Programs.formType)
    }
  },
  rmPrgm: (id, e) => {
    m.request({
      method: 'DELETE',
      url: '/remove-program',
      data: {_id: Programs.currentProgram._id }
    }).then(result => {
      if (result.error) {
        console.log(result.error)
      } else {
        Programs.fetch()
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
      url: '/addProgram',
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
  currentStep: null,
  addStepForm: (type, _id, e) => {
    if (!Programs.isStepForm) {
      Programs.isStepForm = true
      Programs.stepFormType = type
      if (_id) {
        m.request({ method: 'GET', url: `/step/${_id}` }).then(result => {
          if (!result.success) {
            Programs.currentStep = result.step
          } else {
            console.log(result.error)
          }
        })
      }
    }
  },
  cancelStepForm: _ => {
    if (Programs.isStepForm) {
      Programs.isStepForm = false
    }
  },

  resetForm: _ => {
    Programs.isStepForm = false
    Programs.isPrgmForm = false
    Programs.currentStep = null
  }
}

export default Programs
