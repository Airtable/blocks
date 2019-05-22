"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _undo_redo = require("./types/undo_redo");

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

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
    if (!(0, _includes.default)(u).call(u, (0, _values.default)(u).call(u, _undo_redo.UndoRedoModes), mode)) {
      throw new Error('Unexpected UndoRedo mode');
    }

    this._mode = mode;

    this._airtableInterface.setUndoRedoMode(mode);
  }

}

var _default = UndoRedo;
exports.default = _default;