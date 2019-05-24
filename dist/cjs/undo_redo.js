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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _private_utils = require("./private_utils");

var _undo_redo = require("./types/undo_redo");

class UndoRedo {
  constructor(airtableInterface) {
    (0, _defineProperty2.default)(this, "modes", _undo_redo.UndoRedoModes);
    (0, _defineProperty2.default)(this, "_mode", _undo_redo.UndoRedoModes.NONE);
    this._airtableInterface = airtableInterface;
  }

  get mode() {
    return this._mode;
  }

  set mode(mode) {
    if (!(0, _private_utils.values)(_undo_redo.UndoRedoModes).includes(mode)) {
      throw new Error('Unexpected UndoRedo mode');
    }

    this._mode = mode;

    this._airtableInterface.setUndoRedoMode(mode);
  }

}

var _default = UndoRedo;
exports.default = _default;