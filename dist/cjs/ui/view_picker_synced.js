"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _table = _interopRequireDefault(require("../models/table"));

var _view = require("../types/view");

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _view_picker = _interopRequireDefault(require("./view_picker"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _synced = _interopRequireDefault(require("./synced"));

var u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

/** */
var ViewPickerSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ViewPickerSynced, _React$Component);

  function ViewPickerSynced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ViewPickerSynced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ViewPickerSynced).call(this, props));
    _this._viewPicker = null;
    return _this;
  }

  (0, _createClass2.default)(ViewPickerSynced, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._viewPicker, 'No view picker to focus');

      this._viewPicker.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._viewPicker, 'No view picker to blur');

      this._viewPicker.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._viewPicker, 'No view picker to click');

      this._viewPicker.click();
    }
  }, {
    key: "_getViewFromGlobalConfigValue",
    value: function _getViewFromGlobalConfigValue(viewId) {
      var table = this.props.table;

      if (!table || table.isDeleted) {
        return null;
      }

      return typeof viewId === 'string' && table ? table.getViewById(viewId) : null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
      return React.createElement(_synced.default, {
        globalConfigKey: this.props.globalConfigKey,
        render: function render(_ref) {
          var value = _ref.value,
              canSetValue = _ref.canSetValue,
              setValue = _ref.setValue;
          return React.createElement(_view_picker.default, (0, _extends2.default)({
            ref: function ref(el) {
              return _this2._viewPicker = el;
            },
            disabled: _this2.props.disabled || !canSetValue,
            view: _this2._getViewFromGlobalConfigValue(value),
            onChange: function onChange(view) {
              setValue(view ? view.id : null);

              if (_this2.props.onChange) {
                _this2.props.onChange(view);
              }
            }
          }, restOfProps));
        }
      });
    }
  }]);
  return ViewPickerSynced;
}(React.Component);

(0, _defineProperty2.default)(ViewPickerSynced, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  // Passed through to ViewPicker:
  shouldAllowPickingNone: _propTypes.default.bool,
  allowedTypes: _propTypes.default.arrayOf(_propTypes.default.oneOf((0, _values.default)(u).call(u, _view.ViewTypes))),
  placeholder: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});

var _default = (0, _create_data_container.default)(ViewPickerSynced, function (props) {
  return [{
    watch: props.table,
    key: 'views'
  }, {
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;