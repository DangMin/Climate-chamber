import m from 'mithril'
import io from 'socket.io-client'
import { serialize } from '../../global'
import Indicator from '../indicator'
import * as Error from '../indicators/errorIndicator'

const socket = io('http://localhost:8080')
const Programs = {
  list: [],                 /* list of programs */
  stepList: [],             /* list of steps - fetched with program id */
  isPrgmForm: false,        /* is form used */
  currentProgram: null,     /* current chosen program */

  isStepForm: false,        /* is form for adding/editting step used */
  currentStep: {},          /* current chosen step */

  /* Program list related function */
  chooseProgram: (id, e) => {
    m.request({
      method: 'GET',
      url: `/programs/${id}`
    }).then(result => {
      if (!result.success) {
        Indicator.setTitle('Error').setBody(Error.body(result.error)).show()
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
      console.log(result)
      if (result.success) {
        Programs.list = result.programs
      }
    })
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
      url: '/programs/remove',
      data: { _id: Programs.currentProgram._id }
    }).then(result => {
      if (result.error) {
        Indicator.setTitle('Error').setBody(Error.body(result.error)).show()
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
      url: '/programs/edit',
      data: data
    }).then(result => {
      if (result.error) {
        Indicator.setTitle('Error').setBody(Error.body(result.error)).show()
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
      url: '/programs/add',
      data: data
    }).then(rslt => {
      if (rslt.success) {
        Programs.isPrgmForm = false
        Programs.fetch()
      } else {
        Indicator.setTitle('Error').setBody(rslt.error).show()
      }
    })
  },

  /* Step list related function */
  addStepForm: (_id, e) => {
    e.preventDefault()
    if (!Programs.isStepForm) {
      Programs.isStepForm = true
    }
    if (_id) {
      m.request({ method: 'GET', url: `/steps/${_id}` }).then(result => {
        if (result.success) {
          Programs.currentStep = result.step
        } else {
          Indicator.setTitle('Error').setBody(Error.body(result.error)).show()
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
    m.request({ method: 'POST', url: '/steps/add', data: data }).then(result => {
      if (result.success) {
        Programs.fetchStep(data.program_id)
        Programs.resetForm()
      } else {
        Indicator.setTitle('Error').setBody(Error.body(result.error)).show()
      }
    })
  },
  fetchStep: id => {
    console.log('fetch step')
    m.request({ method: 'GET', url: `/steps/${id}` }).then(result => {
      if (result.success) {
        console.log(result)
        Programs.stepList = result.steps
        Programs.isStepForm = false
        m.redraw()
      } else {
        Indicator.setTitle('Error').setBody(Error.body(result.error)).show()
      }
    })
  },
  removeStep: (id, event) => {
    m.request({ method: 'DELETE', url: '/steps/remove', data: {_id: id} }).then(result => {
      if (result.success) {
        Programs.fetchStep(Programs.currentProgram._id)
      } else {
        Indicator.setTitle('Error').setBody(Error.body(result.error)).show()
      }
    })
  },
  editStep: (id, event) => {

  },

  /* Request control */
  startProgram: (e) => {
    e.preventDefault()
    socket.emit('req-startProgram', { program: Programs.currentProgram, steps: Programs.stepList } )
  },
  stopProgram: e => {
    e.preventDefault()
    socket.emit('req-stopProgram', { program: Programs.currentProgram })
  },

  /* helpers */
  resetForm: _ => {
    Programs.isStepForm = false
    Programs.isPrgmForm = false
    Programs.currentStep = null
  }
}

export default Programs
