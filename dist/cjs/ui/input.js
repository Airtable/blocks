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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const validTypesSet = {
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
const typesToExcludeFromDefaultClassesSet = {
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
    let {
      type
    } = this.props;

    if (type && !validTypesSet[type]) {
      type = 'text';
    }

    const {
      disabled,
      required
    } = this.props;
    const defaultClassName = this._shouldUseDefaultClassesForType() ? 'styled-input rounded p1 darken1 text-dark normal' : '';
    const restOfProps = u.omit(this.props, (0, _keys.default)(Input.propTypes));
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