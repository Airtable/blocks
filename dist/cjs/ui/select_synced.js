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

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _select = _interopRequireDefault(require("./select"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

var _synced = _interopRequireDefault(require("./synced"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
/** */


class SelectSynced extends React.Component {
  constructor(props) {
    super(props);
    this._select = null;
  }

  focus() {
    (0, _invariant.default)(this._select, 'No select to focus');

    this._select.focus();
  }

  blur() {
    (0, _invariant.default)(this._select, 'No select to blur');

    this._select.blur();
  }

  click() {
    (0, _invariant.default)(this._select, 'No select to click');

    this._select.click();
  }

  render() {
    const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: ({
        value,
        canSetValue,
        setValue
      }) => React.createElement(_select.default, (0, _extends2.default)({
        ref: el => this._select = el,
        disabled: this.props.disabled || !canSetValue,
        value: value,
        onChange: newValue => {
          setValue(newValue);

          if (this.props.onChange) {
            this.props.onChange(newValue);
          }
        }
      }, restOfProps))
    });
  }

}

(0, _defineProperty2.default)(SelectSynced, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsSyncedPropTypes);
var _default = SelectSynced;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9zZWxlY3Rfc3luY2VkLmpzIl0sIm5hbWVzIjpbInUiLCJ3aW5kb3ciLCJfX3JlcXVpcmVQcml2YXRlTW9kdWxlRnJvbUFpcnRhYmxlIiwiU2VsZWN0U3luY2VkIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiX3NlbGVjdCIsImZvY3VzIiwiYmx1ciIsImNsaWNrIiwicmVuZGVyIiwicmVzdE9mUHJvcHMiLCJvbWl0IiwiZ2xvYmFsQ29uZmlnS2V5IiwidmFsdWUiLCJjYW5TZXRWYWx1ZSIsInNldFZhbHVlIiwiZWwiLCJkaXNhYmxlZCIsIm5ld1ZhbHVlIiwib25DaGFuZ2UiLCJTZWxlY3RBbmRTZWxlY3RCdXR0b25zU3luY2VkUHJvcFR5cGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFJQTs7QUFFQSxNQUFNO0FBQUNBLEVBQUFBO0FBQUQsSUFBTUMsTUFBTSxDQUFDQyxrQ0FBUCxDQUEwQyx5QkFBMUMsQ0FBWjtBQUVBOzs7QUFDQSxNQUFNQyxZQUFOLFNBQTJCQyxLQUFLLENBQUNDLFNBQWpDLENBQThEO0FBSTFEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBMkI7QUFDbEMsVUFBTUEsS0FBTjtBQUVBLFNBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0g7O0FBQ0RDLEVBQUFBLEtBQUssR0FBRztBQUNKLDRCQUFVLEtBQUtELE9BQWYsRUFBd0Isb0JBQXhCOztBQUNBLFNBQUtBLE9BQUwsQ0FBYUMsS0FBYjtBQUNIOztBQUNEQyxFQUFBQSxJQUFJLEdBQUc7QUFDSCw0QkFBVSxLQUFLRixPQUFmLEVBQXdCLG1CQUF4Qjs7QUFDQSxTQUFLQSxPQUFMLENBQWFFLElBQWI7QUFDSDs7QUFDREMsRUFBQUEsS0FBSyxHQUFHO0FBQ0osNEJBQVUsS0FBS0gsT0FBZixFQUF3QixvQkFBeEI7O0FBQ0EsU0FBS0EsT0FBTCxDQUFhRyxLQUFiO0FBQ0g7O0FBQ0RDLEVBQUFBLE1BQU0sR0FBRztBQUNMLFVBQU1DLFdBQVcsR0FBR2IsQ0FBQyxDQUFDYyxJQUFGLENBQU8sS0FBS1AsS0FBWixFQUFtQixDQUFDLGlCQUFELEVBQW9CLFVBQXBCLEVBQWdDLFVBQWhDLENBQW5CLENBQXBCO0FBQ0EsV0FDSSxvQkFBQyxlQUFEO0FBQ0ksTUFBQSxlQUFlLEVBQUUsS0FBS0EsS0FBTCxDQUFXUSxlQURoQztBQUVJLE1BQUEsTUFBTSxFQUFFLENBQUM7QUFBQ0MsUUFBQUEsS0FBRDtBQUFRQyxRQUFBQSxXQUFSO0FBQXFCQyxRQUFBQTtBQUFyQixPQUFELEtBQ0osb0JBQUMsZUFBRDtBQUNJLFFBQUEsR0FBRyxFQUFFQyxFQUFFLElBQUssS0FBS1gsT0FBTCxHQUFlVyxFQUQvQjtBQUVJLFFBQUEsUUFBUSxFQUFFLEtBQUtaLEtBQUwsQ0FBV2EsUUFBWCxJQUF1QixDQUFDSCxXQUZ0QztBQUdJLFFBQUEsS0FBSyxFQUFFRCxLQUhYO0FBSUksUUFBQSxRQUFRLEVBQUVLLFFBQVEsSUFBSTtBQUNsQkgsVUFBQUEsUUFBUSxDQUFDRyxRQUFELENBQVI7O0FBQ0EsY0FBSSxLQUFLZCxLQUFMLENBQVdlLFFBQWYsRUFBeUI7QUFDckIsaUJBQUtmLEtBQUwsQ0FBV2UsUUFBWCxDQUFvQkQsUUFBcEI7QUFDSDtBQUNKO0FBVEwsU0FVUVIsV0FWUjtBQUhSLE1BREo7QUFtQkg7O0FBMUN5RDs7OEJBQXhEVixZLGVBQ2lCb0Isd0U7ZUE0Q1JwQixZIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTZWxlY3QgZnJvbSAnLi9zZWxlY3QnO1xuaW1wb3J0IHtcbiAgICBTZWxlY3RBbmRTZWxlY3RCdXR0b25zU3luY2VkUHJvcFR5cGVzLFxuICAgIHR5cGUgU2VsZWN0QW5kU2VsZWN0QnV0dG9uc1N5bmNlZFByb3BzIGFzIFNlbGVjdFN5bmNlZFByb3BzLFxufSBmcm9tICcuL3NlbGVjdF9hbmRfc2VsZWN0X2J1dHRvbnNfaGVscGVycyc7XG5pbXBvcnQgU3luY2VkIGZyb20gJy4vc3luY2VkJztcblxuY29uc3Qge3V9ID0gd2luZG93Ll9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUoJ2NsaWVudF9zZXJ2ZXJfc2hhcmVkL2h1Jyk7XG5cbi8qKiAqL1xuY2xhc3MgU2VsZWN0U3luY2VkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFNlbGVjdFN5bmNlZFByb3BzPiB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IFNlbGVjdEFuZFNlbGVjdEJ1dHRvbnNTeW5jZWRQcm9wVHlwZXM7XG4gICAgcHJvcHM6IFNlbGVjdFN5bmNlZFByb3BzO1xuICAgIF9zZWxlY3Q6IFNlbGVjdCB8IG51bGw7XG4gICAgY29uc3RydWN0b3IocHJvcHM6IFNlbGVjdFN5bmNlZFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICB0aGlzLl9zZWxlY3QgPSBudWxsO1xuICAgIH1cbiAgICBmb2N1cygpIHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuX3NlbGVjdCwgJ05vIHNlbGVjdCB0byBmb2N1cycpO1xuICAgICAgICB0aGlzLl9zZWxlY3QuZm9jdXMoKTtcbiAgICB9XG4gICAgYmx1cigpIHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuX3NlbGVjdCwgJ05vIHNlbGVjdCB0byBibHVyJyk7XG4gICAgICAgIHRoaXMuX3NlbGVjdC5ibHVyKCk7XG4gICAgfVxuICAgIGNsaWNrKCkge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5fc2VsZWN0LCAnTm8gc2VsZWN0IHRvIGNsaWNrJyk7XG4gICAgICAgIHRoaXMuX3NlbGVjdC5jbGljaygpO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3RPZlByb3BzID0gdS5vbWl0KHRoaXMucHJvcHMsIFsnZ2xvYmFsQ29uZmlnS2V5JywgJ29uQ2hhbmdlJywgJ2Rpc2FibGVkJ10pO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFN5bmNlZFxuICAgICAgICAgICAgICAgIGdsb2JhbENvbmZpZ0tleT17dGhpcy5wcm9wcy5nbG9iYWxDb25maWdLZXl9XG4gICAgICAgICAgICAgICAgcmVuZGVyPXsoe3ZhbHVlLCBjYW5TZXRWYWx1ZSwgc2V0VmFsdWV9KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZj17ZWwgPT4gKHRoaXMuX3NlbGVjdCA9IGVsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkIHx8ICFjYW5TZXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtuZXdWYWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VmFsdWUobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4ucmVzdE9mUHJvcHN9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RTeW5jZWQ7XG4iXX0=