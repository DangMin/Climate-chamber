webpackHotUpdate(0,{

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = __webpack_require__(1);

var _mithril2 = _interopRequireDefault(_mithril);

var _global = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Programs = {
  list: [],
  stepList: [],
  isPrgmForm: false,
  currentProgram: null,
  formType: null,
  chooseProgram: function chooseProgram(id, e) {
    _mithril2.default.request({
      method: 'GET',
      url: '/get-program-by-id/' + id
    }).then(function (result) {
      console.log(result);
      if (result.success) {
        console.log(result.error);
      } else {
        Programs.currentProgram = result.program;
        Programs.stepList = result.steps;
        console.log(Programs.stepList);
      }
    });
  },
  fetch: function fetch() {
    _mithril2.default.request({
      method: 'GET',
      url: '/programs'
    }).then(function (result) {
      Programs.list = result;
    });
  },
  fetchSteps: function fetchSteps(prgm_id) {},
  addFormSignal: function addFormSignal(type, e) {
    if (!Programs.isPrgmForm) {
      Programs.isPrgmForm = true;
      Programs.formType = type;
      console.log(Programs.formType);
    }
  },
  rmPrgm: function rmPrgm(id, e) {
    _mithril2.default.request({
      method: 'DELETE',
      url: '/remove-program',
      data: { _id: Programs.currentProgram._id }
    }).then(function (result) {
      if (result.error) {
        console.log(result.error);
      } else {
        Programs.fetch();
      }
    });
  },
  cancelForm: function cancelForm(event) {
    event.preventDefault();
    if (Programs.isPrgmForm) {
      Programs.isPrgmForm = false;
    }
  },
  editProgram: function editProgram(event) {
    event.preventDefault();
    var data = (0, _global.serialize)(document.getElementById('form-program-js'));
    _mithril2.default.request({
      method: 'POST',
      url: '/edit-program',
      data: data
    }).then(function (result) {
      if (result.error) {
        console.log(result.error);
      }
      Programs.fetch();
      Programs.isPrgmForm = false;
    });
  },
  addProgram: function addProgram(event) {
    event.preventDefault();
    var form = document.getElementById('form-program-js');
    var data = (0, _global.serialize)(form);
    _mithril2.default.request({
      method: 'POST',
      url: '/addProgram',
      data: data
    }).then(function (rslt) {
      if (rslt.success) {
        Programs.fetch();
        Programs.isPrgmForm = false;
      }
    });
  },

  isStepForm: false,
  stepFormType: null,
  addStepForm: function addStepForm(type, e) {
    if (!Programs.isStepForm) {
      Programs.isStepForm = true;
      Programs.stepFormType = type;
    }
  },
  cancelStepForm: function cancelStepForm(_) {
    if (Programs.isStepForm) {
      Programs.isStepForm = false;
    }
  }
};

exports.default = Programs;

/***/ })

})