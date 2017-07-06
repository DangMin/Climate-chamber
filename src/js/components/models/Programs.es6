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
  rmPrgm: (id, e) => {
    console.log(id)
    m.request({
      method: 'DELETE',
      url: '/remove-program',
      data: {_id: Programs.currentProgram }
    }).then(result => {
      console.log(result)
      if (result.error) {
        console.log(result.error)
      } else {
        Programs.fetch()
      }
    })
  },
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
      if (rslt.success) {
        Programs.fetch()
      }
    })
  }

}

export default Programs
