"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var validTypesSet = {
  checkbox: true,
  color: true,
  date: true,
  'datetime-local': true,
  email: true,
  hidden: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};
var typesToExcludeFromDefaultClassesSet = {
  checkbox: true,
  color: true,
  range: true
};
/** */

var Input =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Input, _React$Component);

  function Input(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Input);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Input).call(this, props));
    _this._input = null;
    return _this;
  }

  (0, _createClass2.default)(Input, [{
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
    key: "_shouldUseDefaultClassesForType",
    value: function _shouldUseDefaultClassesForType() {
      return !this.props.type || !typesToExcludeFromDefaultClassesSet[this.props.type];
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var type = this.props.type;

      if (type && !validTypesSet[type]) {
        type = 'text';
      }

      var _this$props = this.props,
          disabled = _this$props.disabled,
          required = _this$props.required;
      var defaultClassName = this._shouldUseDefaultClassesForType() ? 'styled-input rounded p1 darken1 text-dark normal' : '';
      var restOfProps = u.omit(this.props, (0, _keys.default)(Input.propTypes));
      return React.createElement("input", (0, _extends2.default)({
        ref: function ref(el) {
          return _this2._input = el;
        },
        type: type,
        placeholder: this.props.placeholder,
        style: this.props.style,
        className: (0, _classnames.default)(defaultClassName, {
          quieter: disabled,
          'link-quiet': !disabled
        }, this.props.className),
        disabled: disabled,
        required: required,
        onChange: this.props.onChange,
        spellCheck: this.props.spellCheck,
        tabIndex: this.props.tabIndex
      }, restOfProps));
    }
  }]);
  return Input;
}(React.Component);

(0, _defineProperty2.default)(Input, "validTypesSet", validTypesSet);
(0, _defineProperty2.default)(Input, "propTypes", {
  type: _propTypes.default.oneOf((0, _keys.default)(validTypesSet)),
  placeholder: _propTypes.default.string,
  onChange: _propTypes.default.func,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  required: _propTypes.default.bool,
  spellCheck: _propTypes.default.bool,
  tabIndex: _propTypes.default.number
});
(0, _defineProperty2.default)(Input, "defaultProps", {
  tabIndex: 0
});
var _default = Input;
exports.default = _default;