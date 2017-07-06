import m from 'mithril'
import { serialize } from '../../global'

const Programs = {
  list: [],
  stepList: [],
  isPrgmForm: false,
  currentProgram: null,
  chooseProgram: (id, e) => {
    Programs.currentProgram = id
  },
  fetch: () => {
    m.request({
      method: 'GET',
      url: '/programs',
    }).then(result => {
      console.log(result)
      Programs.list = result
    })
  },
  fetchSteps: (prgm_id) => {
  },
  addFormSignal: () => {
    if (!Programs.isPrgmForm) {
      Programs.isPrgmForm = true
    }
  },
  rmPrgm: () => {},
  cancelAddPrgm: event => {
    event.preventDefault()
    if (Programs.isPrgmForm) {
      Programs.isPrgmForm = false
    }
  },
  addProgram: event => {
    event.preventDefault()
    const form = document.getElementById('add-program-js')
    const data = serialize(form)
    m.request({
      method: 'POST',
      url: '/addProgram',
      data: data
    }).then(rslt => {
      console.log(rslt)
      if (rslt.success) {
        Programs.fetch()
      }
    })
  }

}

export default Programs
