import m from 'mithril'
import serialize from 'form-serialize'

const Programs = {
  list: [],
  stepList: [],
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
  addProgram: (form_id) => {
    
  }

}

export default Programs
