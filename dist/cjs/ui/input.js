"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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

class Input extends React.Component {
  constructor(props) {
    super(props);
    this._input = null;
  }

  focus() {
    (0, _invariant.default)(this._input, 'No input to focus');

    this._input.focus();
  }

  blur() {
    (0, _invariant.default)(this._input, 'No input to blur');

    this._input.blur();
  }

  click() {
    (0, _invariant.default)(this._input, 'No input to click');

    this._input.click();
  }

  select() {
    (0, _invariant.default)(this._input, 'No input to select');

    this._input.select();
  }

  _shouldUseDefaultClassesForType() {
    return !this.props.type || !typesToExcludeFromDefaultClassesSet[this.props.type];
  }

  render() {
    var type = this.props.type;

    if (type && !validTypesSet[type]) {
      type = 'text';
    }

    var _this$props = this.props,
        disabled = _this$props.disabled,
        required = _this$props.required;
    var defaultClassName = this._shouldUseDefaultClassesForType() ? 'styled-input rounded p1 darken1 text-dark normal' : '';
    var restOfProps = u.omit(this.props, Object.keys(Input.propTypes));
    return React.createElement("input", (0, _extends2.default)({
      ref: el => this._input = el,
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

}

(0, _defineProperty2.default)(Input, "validTypesSet", validTypesSet);
(0, _defineProperty2.default)(Input, "propTypes", {
  type: _propTypes.default.oneOf(Object.keys(validTypesSet)),
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