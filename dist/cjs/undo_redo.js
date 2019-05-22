"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _undo_redo = require("./types/undo_redo");

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var UndoRedo =
/*#__PURE__*/
function () {
  function UndoRedo(airtableInterface) {
    (0, _classCallCheck2.default)(this, UndoRedo);
    (0, _defineProperty2.default)(this, "modes", _undo_redo.UndoRedoModes);
    (0, _defineProperty2.default)(this, "_mode", _undo_redo.UndoRedoModes.NONE);
    this._airtableInterface = airtableInterface;
  }

  (0, _createClass2.default)(UndoRedo, [{
    key: "mode",
    get: function get() {
      return this._mode;
    },
    set: function set(mode) {
      if (!(0, _includes.default)(u).call(u, (0, _values.default)(u).call(u, _undo_redo.UndoRedoModes), mode)) {
        throw new Error('Unexpected UndoRedo mode');
      }

      this._mode = mode;

      this._airtableInterface.setUndoRedoMode(mode);
    }
  }]);
  return UndoRedo;
}();

var _default = UndoRedo;
exports.default = _default;