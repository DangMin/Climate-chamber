webpackHotUpdate(0,{

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = __webpack_require__(1);

var _mithril2 = _interopRequireDefault(_mithril);

var _serialState = __webpack_require__(47);

var _serialState2 = _interopRequireDefault(_serialState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var c = {
  view: function view(_) {
    return [(0, _mithril2.default)('.header--left', [(0, _mithril2.default)('h1.header__title', 'CLIMATE CHAMBER')]), (0, _mithril2.default)('.header--right.serialport', [(0, _mithril2.default)('.serialport__state', [(0, _mithril2.default)('p', [(0, _mithril2.default)('span', 'Serial connection: '), (0, _mithril2.default)('i.fa.fa-2x', { class: _serialState2.default.state ? 'fa-check-circle' : 'fa-times-circle' })])]), (0, _mithril2.default)('.serialport__control', [!_serialState2.default.state ? (0, _mithril2.default)('button[type=button]', { onclick: _serialState2.default.reqConnection }, 'Connect') : (0, _mithril2.default)('button[type=button]', { onclick: _serialState2.default.disconnect }, 'Disconnect')])])];
  }
};

exports.default = c;

/***/ })

})