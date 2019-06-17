"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var themes = Object.freeze({
  GREEN: 'green',
  BLUE: 'blue',
  RED: 'red',
  YELLOW: 'yellow',
  GRAY: 'gray'
});
var classNamesByTheme = {
  [themes.GREEN]: 'green',
  [themes.BLUE]: 'blue',
  [themes.RED]: 'red',
  [themes.YELLOW]: 'yellow',
  [themes.GRAY]: 'gray'
};
/**
 * @typedef {object} ToggleProps
 * @property {boolean} value If set to `true`, the switch will be toggled on.
 * @property {function} [onChange] A function to be called when the switch is toggled.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the switch.
 * @property {React.Node} [label] The label node for the switch.
 * @property {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW | Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.
 * @property {string} [id] The ID of the switch element.
 * @property {string} [className] Additional class names to apply to the switch.
 * @property {object} [style] Additional styles to apply to the switch.
 * @property {number | string} [tabIndex] Indicates if the switch can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-label] The label for the switch. Use this if the switch lacks a visible text label.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */

/**
 * A toggleable switch for controlling boolean values. Functionally analogous to a checkbox.
 *
 * @example
 * import {Toggle} from '@airtable/blocks/ui';
 * import React, {useState} from 'react';
 *
 * function Block() {
 *     const [isEnabled, setIsEnabled] = useState(false);
 *     return (
 *         <Toggle
 *             value={isEnabled}
 *             onChange={setIsEnabled}
 *             label={isEnabled ? 'On' : 'Off'}
 *         />
 *     );
 * }
 */
var Toggle =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Toggle, _React$Component);

  function Toggle(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Toggle);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Toggle).call(this, props)); // TODO (stephen): use React.forwardRef

    _this._container = null;
    _this._onKeyDown = _this._onKeyDown.bind((0, _assertThisInitialized2.default)(_this));
    _this._toggleValue = _this._toggleValue.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Toggle, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._container, 'No toggle to focus');

      this._container.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._container, 'No toggle to blur');

      this._container.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._container, 'No toggle to click');

      this._container.click();
    }
  }, {
    key: "_onKeyDown",
    value: function _onKeyDown(e) {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();

        this._toggleValue();
      }
    }
  }, {
    key: "_toggleValue",
    value: function _toggleValue() {
      var _this$props = this.props,
          value = _this$props.value,
          onChange = _this$props.onChange,
          disabled = _this$props.disabled;

      if (onChange && !disabled) {
        onChange(!value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          value = _this$props2.value,
          disabled = _this$props2.disabled,
          label = _this$props2.label,
          theme = _this$props2.theme,
          id = _this$props2.id,
          className = _this$props2.className,
          style = _this$props2.style,
          tabIndex = _this$props2.tabIndex;
      var toggleHeight = 12;
      var togglePadding = 2;
      var toggleClassNameForTheme = theme && classNamesByTheme[theme];
      return React.createElement("label", {
        className: "flex-inline"
      }, React.createElement("div", {
        ref: el => this._container = el,
        onClick: this._toggleValue,
        onKeyDown: this._onKeyDown,
        id: id,
        className: (0, _classnames.default)('focusable flex-inline items-center p-half rounded', {
          'pointer link-quiet': !disabled,
          'noevents quieter': disabled
        }, className),
        style: style,
        tabIndex: disabled ? -1 : tabIndex,
        "aria-label": this.props['aria-label'],
        "aria-labelledby": this.props['aria-labelledby'],
        "aria-describedby": this.props['aria-describedby']
      }, React.createElement("div", {
        className: (0, _classnames.default)('pill flex animate flex-none', {
          'justify-start darken2': !value,
          'justify-end': value,
          [toggleClassNameForTheme || '']: value
        }),
        style: {
          height: toggleHeight,
          width: toggleHeight * 1.6,
          padding: togglePadding
        }
      }, React.createElement("div", {
        className: "white circle flex-none",
        style: {
          width: toggleHeight - 2 * togglePadding
        }
      })), label && React.createElement("div", {
        className: "flex-auto ml1 normal text-dark"
      }, label)));
    }
  }]);
  return Toggle;
}(React.Component);

(0, _defineProperty2.default)(Toggle, "themes", themes);
(0, _defineProperty2.default)(Toggle, "propTypes", {
  value: _propTypes.default.bool.isRequired,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  label: _propTypes.default.node,
  theme: _propTypes.default.oneOf(Object.keys(classNamesByTheme)),
  id: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  'aria-label': _propTypes.default.string,
  'aria-labelledby': _propTypes.default.string,
  'aria-describedby': _propTypes.default.string
});
(0, _defineProperty2.default)(Toggle, "defaultProps", {
  tabIndex: 0,
  theme: themes.GREEN
});
var _default = Toggle;
exports.default = _default;