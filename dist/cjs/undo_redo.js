"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _private_utils = require("./private_utils");

var _undo_redo = require("./types/undo_redo");

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
      if (!(0, _private_utils.values)(_undo_redo.UndoRedoModes).includes(mode)) {
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