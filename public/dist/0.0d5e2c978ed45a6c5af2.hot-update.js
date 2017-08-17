webpackHotUpdate(0,{

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = __webpack_require__(1);

var _mithril2 = _interopRequireDefault(_mithril);

var _socket = __webpack_require__(5);

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = (0, _socket2.default)('http://localhost:8080');

var SerialState = {
  state: false,
  reqConnection: function reqConnection() {
    if (!SerialState.state) {
      socket.emit('req-connect', function (data) {
        if (data.error) {
          console.log('Error: ' + data.message);
        } else {
          SerialState.state = data.state;
        }
      });
    }
  },
  disconnect: function disconnect() {
    if (SerialState.state) {
      socket.emit('req-disconnect', function (data) {
        if (data.error) {
          console.log('Error: ' + data.message);
        } else {
          SerialState.state = data.state;
        }
      });
    }
  }
};

socket.on('serial-state', function (data) {
  if (data.error) {
    console.log('Error: ' + data.message);
  } else {
    SerialState.state = data.state;
  }

  _mithril2.default.redraw();
});

exports.default = SerialState;

/***/ })

})