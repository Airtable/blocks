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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91bmRvX3JlZG8uanMiXSwibmFtZXMiOlsidSIsIndpbmRvdyIsIl9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUiLCJVbmRvUmVkbyIsImNvbnN0cnVjdG9yIiwiYWlydGFibGVJbnRlcmZhY2UiLCJVbmRvUmVkb01vZGVzIiwiTk9ORSIsIl9haXJ0YWJsZUludGVyZmFjZSIsIm1vZGUiLCJfbW9kZSIsIkVycm9yIiwic2V0VW5kb1JlZG9Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFHQSxNQUFNO0FBQUNBLEVBQUFBO0FBQUQsSUFBTUMsTUFBTSxDQUFDQyxrQ0FBUCxDQUEwQyx5QkFBMUMsQ0FBWjs7QUFFQSxNQUFNQyxRQUFOLENBQWU7QUFNWEMsRUFBQUEsV0FBVyxDQUFDQyxpQkFBRCxFQUF1QztBQUFBLGlEQUwxQ0Msd0JBSzBDO0FBQUEsaURBRjVCQSx5QkFBY0MsSUFFYztBQUM5QyxTQUFLQyxrQkFBTCxHQUEwQkgsaUJBQTFCO0FBQ0g7O0FBQ0QsTUFBSUksSUFBSixHQUF5QjtBQUNyQixXQUFPLEtBQUtDLEtBQVo7QUFDSDs7QUFDRCxNQUFJRCxJQUFKLENBQVNBLElBQVQsRUFBNkI7QUFDekIsUUFBSSxDQUFDLHVCQUFBVCxDQUFDLE1BQUQsQ0FBQUEsQ0FBQyxFQUFVLHFCQUFBQSxDQUFDLE1BQUQsQ0FBQUEsQ0FBQyxFQUFRTSx3QkFBUixDQUFYLEVBQW1DRyxJQUFuQyxDQUFOLEVBQWdEO0FBQzVDLFlBQU0sSUFBSUUsS0FBSixDQUFVLDBCQUFWLENBQU47QUFDSDs7QUFDRCxTQUFLRCxLQUFMLEdBQWFELElBQWI7O0FBRUEsU0FBS0Qsa0JBQUwsQ0FBd0JJLGVBQXhCLENBQXdDSCxJQUF4QztBQUNIOztBQW5CVTs7ZUFzQkFOLFEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IHtVbmRvUmVkb01vZGVzLCB0eXBlIFVuZG9SZWRvTW9kZX0gZnJvbSAnLi90eXBlcy91bmRvX3JlZG8nO1xuaW1wb3J0IHt0eXBlIEFpcnRhYmxlSW50ZXJmYWNlfSBmcm9tICcuL2luamVjdGVkL2FpcnRhYmxlX2ludGVyZmFjZSc7XG5cbmNvbnN0IHt1fSA9IHdpbmRvdy5fX3JlcXVpcmVQcml2YXRlTW9kdWxlRnJvbUFpcnRhYmxlKCdjbGllbnRfc2VydmVyX3NoYXJlZC9odScpO1xuXG5jbGFzcyBVbmRvUmVkbyB7XG4gICAgbW9kZXMgPSBVbmRvUmVkb01vZGVzO1xuXG4gICAgX2FpcnRhYmxlSW50ZXJmYWNlOiBBaXJ0YWJsZUludGVyZmFjZTtcbiAgICBfbW9kZTogVW5kb1JlZG9Nb2RlID0gVW5kb1JlZG9Nb2Rlcy5OT05FO1xuXG4gICAgY29uc3RydWN0b3IoYWlydGFibGVJbnRlcmZhY2U6IEFpcnRhYmxlSW50ZXJmYWNlKSB7XG4gICAgICAgIHRoaXMuX2FpcnRhYmxlSW50ZXJmYWNlID0gYWlydGFibGVJbnRlcmZhY2U7XG4gICAgfVxuICAgIGdldCBtb2RlKCk6IFVuZG9SZWRvTW9kZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlO1xuICAgIH1cbiAgICBzZXQgbW9kZShtb2RlOiBVbmRvUmVkb01vZGUpIHtcbiAgICAgICAgaWYgKCF1LmluY2x1ZGVzKHUudmFsdWVzKFVuZG9SZWRvTW9kZXMpLCBtb2RlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIFVuZG9SZWRvIG1vZGUnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tb2RlID0gbW9kZTtcblxuICAgICAgICB0aGlzLl9haXJ0YWJsZUludGVyZmFjZS5zZXRVbmRvUmVkb01vZGUobW9kZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVbmRvUmVkbztcbiJdfQ==