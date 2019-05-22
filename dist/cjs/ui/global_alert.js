"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _seal = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/seal"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _private_utils = _interopRequireDefault(require("../private_utils"));

var _watchable = _interopRequireDefault(require("../watchable"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

const WatchableGlobalAlertKeys = {
  __alertInfo: '__alertInfo'
};

/**
 * @example
 * import {UI} from 'airtable-block';
 * UI.globalAlert.showReloadPrompt();
 */
class GlobalAlert extends _watchable.default {
  static _isWatchableKey(key) {
    return _private_utils.default.isEnumValue(WatchableGlobalAlertKeys, key);
  }

  constructor() {
    super();
    this._alertInfo = null;
    (0, _seal.default)(this);
  }

  get __alertInfo() {
    return this._alertInfo;
  }
  /** */


  showReloadPrompt() {
    this._alertInfo = {
      content: React.createElement("span", {
        className: "center line-height-4 quiet strong"
      }, React.createElement("span", {
        className: "pointer understroke link-unquiet",
        onClick: () => {
          (0, _get_sdk.default)().reload();
        }
      }, "Please reload"))
    };

    this._onChange(WatchableGlobalAlertKeys.__alertInfo);
  }

}

(0, _defineProperty2.default)(GlobalAlert, "_className", 'GlobalAlert');
var _default = GlobalAlert;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9nbG9iYWxfYWxlcnQuanMiXSwibmFtZXMiOlsiV2F0Y2hhYmxlR2xvYmFsQWxlcnRLZXlzIiwiX19hbGVydEluZm8iLCJHbG9iYWxBbGVydCIsIldhdGNoYWJsZSIsIl9pc1dhdGNoYWJsZUtleSIsImtleSIsInV0aWxzIiwiaXNFbnVtVmFsdWUiLCJjb25zdHJ1Y3RvciIsIl9hbGVydEluZm8iLCJzaG93UmVsb2FkUHJvbXB0IiwiY29udGVudCIsInJlbG9hZCIsIl9vbkNoYW5nZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsTUFBTUEsd0JBQXdCLEdBQUc7QUFDN0JDLEVBQUFBLFdBQVcsRUFBRTtBQURnQixDQUFqQzs7QUFTQTs7Ozs7QUFLQSxNQUFNQyxXQUFOLFNBQTBCQyxrQkFBMUIsQ0FBNkQ7QUFFekQsU0FBT0MsZUFBUCxDQUF1QkMsR0FBdkIsRUFBNkM7QUFDekMsV0FBT0MsdUJBQU1DLFdBQU4sQ0FBa0JQLHdCQUFsQixFQUE0Q0ssR0FBNUMsQ0FBUDtBQUNIOztBQUVERyxFQUFBQSxXQUFXLEdBQUc7QUFDVjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSx1QkFBWSxJQUFaO0FBQ0g7O0FBQ0QsTUFBSVIsV0FBSixHQUFvQztBQUNoQyxXQUFPLEtBQUtRLFVBQVo7QUFDSDtBQUNEOzs7QUFDQUMsRUFBQUEsZ0JBQWdCLEdBQUc7QUFDZixTQUFLRCxVQUFMLEdBQWtCO0FBQ2RFLE1BQUFBLE9BQU8sRUFDSDtBQUFNLFFBQUEsU0FBUyxFQUFDO0FBQWhCLFNBQ0k7QUFDSSxRQUFBLFNBQVMsRUFBQyxrQ0FEZDtBQUVJLFFBQUEsT0FBTyxFQUFFLE1BQU07QUFDWCxrQ0FBU0MsTUFBVDtBQUNIO0FBSkwseUJBREo7QUFGVSxLQUFsQjs7QUFjQSxTQUFLQyxTQUFMLENBQWViLHdCQUF3QixDQUFDQyxXQUF4QztBQUNIOztBQS9Cd0Q7OzhCQUF2REMsVyxnQkFDa0IsYTtlQWlDVEEsVyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB1dGlscyBmcm9tICcuLi9wcml2YXRlX3V0aWxzJztcbmltcG9ydCBXYXRjaGFibGUgZnJvbSAnLi4vd2F0Y2hhYmxlJztcbmltcG9ydCBnZXRTZGsgZnJvbSAnLi4vZ2V0X3Nkayc7XG5cbmNvbnN0IFdhdGNoYWJsZUdsb2JhbEFsZXJ0S2V5cyA9IHtcbiAgICBfX2FsZXJ0SW5mbzogJ19fYWxlcnRJbmZvJyxcbn07XG50eXBlIFdhdGNoYWJsZUdsb2JhbEFsZXJ0S2V5ID0gJEtleXM8dHlwZW9mIFdhdGNoYWJsZUdsb2JhbEFsZXJ0S2V5cz47XG5cbnR5cGUgQWxlcnRJbmZvID0ge1xuICAgIGNvbnRlbnQ6IFJlYWN0JEVsZW1lbnQ8Kj4sXG59O1xuXG4vKipcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge1VJfSBmcm9tICdhaXJ0YWJsZS1ibG9jayc7XG4gKiBVSS5nbG9iYWxBbGVydC5zaG93UmVsb2FkUHJvbXB0KCk7XG4gKi9cbmNsYXNzIEdsb2JhbEFsZXJ0IGV4dGVuZHMgV2F0Y2hhYmxlPFdhdGNoYWJsZUdsb2JhbEFsZXJ0S2V5PiB7XG4gICAgc3RhdGljIF9jbGFzc05hbWUgPSAnR2xvYmFsQWxlcnQnO1xuICAgIHN0YXRpYyBfaXNXYXRjaGFibGVLZXkoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHV0aWxzLmlzRW51bVZhbHVlKFdhdGNoYWJsZUdsb2JhbEFsZXJ0S2V5cywga2V5KTtcbiAgICB9XG4gICAgX2FsZXJ0SW5mbzogQWxlcnRJbmZvIHwgbnVsbDtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fYWxlcnRJbmZvID0gbnVsbDtcbiAgICAgICAgT2JqZWN0LnNlYWwodGhpcyk7XG4gICAgfVxuICAgIGdldCBfX2FsZXJ0SW5mbygpOiBBbGVydEluZm8gfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsZXJ0SW5mbztcbiAgICB9XG4gICAgLyoqICovXG4gICAgc2hvd1JlbG9hZFByb21wdCgpIHtcbiAgICAgICAgdGhpcy5fYWxlcnRJbmZvID0ge1xuICAgICAgICAgICAgY29udGVudDogKFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNlbnRlciBsaW5lLWhlaWdodC00IHF1aWV0IHN0cm9uZ1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicG9pbnRlciB1bmRlcnN0cm9rZSBsaW5rLXVucXVpZXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFNkaygpLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgUGxlYXNlIHJlbG9hZFxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UoV2F0Y2hhYmxlR2xvYmFsQWxlcnRLZXlzLl9fYWxlcnRJbmZvKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdsb2JhbEFsZXJ0O1xuIl19