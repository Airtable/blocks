"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

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

var _input = _interopRequireDefault(require("./input"));

var _synced = _interopRequireDefault(require("./synced"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

/** */
var InputSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(InputSynced, _React$Component);

  function InputSynced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, InputSynced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(InputSynced).call(this, props));
    _this._input = null;
    return _this;
  }

  (0, _createClass2.default)(InputSynced, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._input, 'No input to focus');

      this._input.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._input, 'No input to blur');

      this._input.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._input, 'No input to click');

      this._input.click();
    }
  }, {
    key: "select",
    value: function select() {
      (0, _invariant.default)(this._input, 'No input to select');

      this._input.select();
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
          var isCheckbox = _this2.props.type === 'checkbox'; // If an input gets null or undefined for value, React treats it as uncontrolled
          // and will throw warnings when it becomes controlled.

          var isNullOrUndefined = value === null || value === undefined;
          var valueObj = isCheckbox ? {
            checked: isNullOrUndefined ? false : value
          } : {
            value: isNullOrUndefined ? '' : value
          };
          return React.createElement(_input.default, (0, _extends2.default)({
            ref: function ref(el) {
              return _this2._input = el;
            },
            disabled: _this2.props.disabled || !canSetValue,
            onChange: function onChange(e) {
              setValue(isCheckbox ? e.target.checked : e.target.value);

              if (_this2.props.onChange) {
                _this2.props.onChange(e);
              }
            },
            spellCheck: _this2.props.spellCheck
          }, valueObj, restOfProps));
        }
      });
    }
  }]);
  return InputSynced;
}(React.Component);

(0, _defineProperty2.default)(InputSynced, "defaultProps", {
  type: 'text',
  spellCheck: true
});
(0, _defineProperty2.default)(InputSynced, "propTypes", {
  type: _propTypes.default.oneOf((0, _keys.default)(_input.default.validTypesSet)),
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  placeholder: _propTypes.default.string,
  onChange: _propTypes.default.func,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  spellCheck: _propTypes.default.bool
});
var _default = InputSynced;
exports.default = _default;