"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _select_buttons = _interopRequireDefault(require("./select_buttons"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

var _synced = _interopRequireDefault(require("./synced"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
/** */


class SelectButtonsSynced extends React.Component {
  render() {
    const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: ({
        value,
        canSetValue,
        setValue
      }) => React.createElement(_select_buttons.default, (0, _extends2.default)({
        disabled: this.props.disabled || !canSetValue,
        value: value,
        onChange: newValue => {
          setValue(newValue);

          if (this.props.onChange) {
            this.props.onChange(newValue);
          }
        } // NOTE: blocks rely on being able to override `value` because
        // of this implementation detail. It's helpful when you want the
        // reads to go through some getter instead of using the raw globalConfig
        // value (e.g. to respect defaults).

      }, restOfProps))
    });
  }

}

(0, _defineProperty2.default)(SelectButtonsSynced, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsSyncedPropTypes);
var _default = SelectButtonsSynced;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9zZWxlY3RfYnV0dG9uc19zeW5jZWQuanMiXSwibmFtZXMiOlsidSIsIndpbmRvdyIsIl9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUiLCJTZWxlY3RCdXR0b25zU3luY2VkIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJyZXN0T2ZQcm9wcyIsIm9taXQiLCJwcm9wcyIsImdsb2JhbENvbmZpZ0tleSIsInZhbHVlIiwiY2FuU2V0VmFsdWUiLCJzZXRWYWx1ZSIsImRpc2FibGVkIiwibmV3VmFsdWUiLCJvbkNoYW5nZSIsIlNlbGVjdEFuZFNlbGVjdEJ1dHRvbnNTeW5jZWRQcm9wVHlwZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUlBOztBQUVBLE1BQU07QUFBQ0EsRUFBQUE7QUFBRCxJQUFNQyxNQUFNLENBQUNDLGtDQUFQLENBQTBDLHlCQUExQyxDQUFaO0FBRUE7OztBQUNBLE1BQU1DLG1CQUFOLFNBQWtDQyxLQUFLLENBQUNDLFNBQXhDLENBQTRFO0FBR3hFQyxFQUFBQSxNQUFNLEdBQUc7QUFDTCxVQUFNQyxXQUFXLEdBQUdQLENBQUMsQ0FBQ1EsSUFBRixDQUFPLEtBQUtDLEtBQVosRUFBbUIsQ0FBQyxpQkFBRCxFQUFvQixVQUFwQixFQUFnQyxVQUFoQyxDQUFuQixDQUFwQjtBQUNBLFdBQ0ksb0JBQUMsZUFBRDtBQUNJLE1BQUEsZUFBZSxFQUFFLEtBQUtBLEtBQUwsQ0FBV0MsZUFEaEM7QUFFSSxNQUFBLE1BQU0sRUFBRSxDQUFDO0FBQUNDLFFBQUFBLEtBQUQ7QUFBUUMsUUFBQUEsV0FBUjtBQUFxQkMsUUFBQUE7QUFBckIsT0FBRCxLQUNKLG9CQUFDLHVCQUFEO0FBQ0ksUUFBQSxRQUFRLEVBQUUsS0FBS0osS0FBTCxDQUFXSyxRQUFYLElBQXVCLENBQUNGLFdBRHRDO0FBRUksUUFBQSxLQUFLLEVBQUVELEtBRlg7QUFHSSxRQUFBLFFBQVEsRUFBRUksUUFBUSxJQUFJO0FBQ2xCRixVQUFBQSxRQUFRLENBQUNFLFFBQUQsQ0FBUjs7QUFDQSxjQUFJLEtBQUtOLEtBQUwsQ0FBV08sUUFBZixFQUF5QjtBQUNyQixpQkFBS1AsS0FBTCxDQUFXTyxRQUFYLENBQW9CRCxRQUFwQjtBQUNIO0FBQ0osU0FSTCxDQVNJO0FBQ0E7QUFDQTtBQUNBOztBQVpKLFNBYVFSLFdBYlI7QUFIUixNQURKO0FBc0JIOztBQTNCdUU7OzhCQUF0RUosbUIsZUFDaUJjLHdFO2VBNkJSZCxtQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgU2VsZWN0QnV0dG9ucyBmcm9tICcuL3NlbGVjdF9idXR0b25zJztcbmltcG9ydCB7XG4gICAgU2VsZWN0QW5kU2VsZWN0QnV0dG9uc1N5bmNlZFByb3BUeXBlcyxcbiAgICB0eXBlIFNlbGVjdEFuZFNlbGVjdEJ1dHRvbnNTeW5jZWRQcm9wcyBhcyBTZWxlY3RCdXR0b25zU3luY2VkUHJvcHMsXG59IGZyb20gJy4vc2VsZWN0X2FuZF9zZWxlY3RfYnV0dG9uc19oZWxwZXJzJztcbmltcG9ydCBTeW5jZWQgZnJvbSAnLi9zeW5jZWQnO1xuXG5jb25zdCB7dX0gPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZSgnY2xpZW50X3NlcnZlcl9zaGFyZWQvaHUnKTtcblxuLyoqICovXG5jbGFzcyBTZWxlY3RCdXR0b25zU3luY2VkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFNlbGVjdEJ1dHRvbnNTeW5jZWRQcm9wcz4ge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSBTZWxlY3RBbmRTZWxlY3RCdXR0b25zU3luY2VkUHJvcFR5cGVzO1xuICAgIHByb3BzOiBTZWxlY3RCdXR0b25zU3luY2VkUHJvcHM7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCByZXN0T2ZQcm9wcyA9IHUub21pdCh0aGlzLnByb3BzLCBbJ2dsb2JhbENvbmZpZ0tleScsICdvbkNoYW5nZScsICdkaXNhYmxlZCddKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxTeW5jZWRcbiAgICAgICAgICAgICAgICBnbG9iYWxDb25maWdLZXk9e3RoaXMucHJvcHMuZ2xvYmFsQ29uZmlnS2V5fVxuICAgICAgICAgICAgICAgIHJlbmRlcj17KHt2YWx1ZSwgY2FuU2V0VmFsdWUsIHNldFZhbHVlfSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8U2VsZWN0QnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWQgfHwgIWNhblNldFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e25ld1ZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IGJsb2NrcyByZWx5IG9uIGJlaW5nIGFibGUgdG8gb3ZlcnJpZGUgYHZhbHVlYCBiZWNhdXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvZiB0aGlzIGltcGxlbWVudGF0aW9uIGRldGFpbC4gSXQncyBoZWxwZnVsIHdoZW4geW91IHdhbnQgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZWFkcyB0byBnbyB0aHJvdWdoIHNvbWUgZ2V0dGVyIGluc3RlYWQgb2YgdXNpbmcgdGhlIHJhdyBnbG9iYWxDb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhbHVlIChlLmcuIHRvIHJlc3BlY3QgZGVmYXVsdHMpLlxuICAgICAgICAgICAgICAgICAgICAgICAgey4uLnJlc3RPZlByb3BzfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0QnV0dG9uc1N5bmNlZDtcbiJdfQ==