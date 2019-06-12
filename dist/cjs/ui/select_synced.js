"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _select = _interopRequireDefault(require("./select"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

var _synced = _interopRequireDefault(require("./synced"));

/**
 * Dropdown menu component synced with {@link GlobalConfig}. A wrapper around `<select>` that fits in with Airtable's user interface.
 *
 * @example
 * import {SelectSynced} from '@airtable/blocks/ui';
 * import React from 'react';
 *
 * function ColorPickerSynced() {
 *     return (
 *         <label>
 *             <div style={{marginBottom: 8, fontWeight: 500}}>Color</div>
 *             <SelectSynced
 *                 globalConfigKey='color'
 *                 options={[
 *                     {value: null, label: 'Pick a color...', disabled: true},
 *                     {value: 'red', label: 'red'},
 *                     {value: 'green', label: 'green'},
 *                     {value: 'blue', label: 'blue'},
 *                 ]}
 *             />
 *         </label>
 *     );
 * }
 */
var SelectSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(SelectSynced, _React$Component);

  function SelectSynced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, SelectSynced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SelectSynced).call(this, props)); // TODO (stephen): use React.forwardRef

    _this._select = null;
    return _this;
  }

  (0, _createClass2.default)(SelectSynced, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._select, 'No select to focus');

      this._select.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._select, 'No select to blur');

      this._select.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._select, 'No select to click');

      this._select.click();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          globalConfigKey = _this$props.globalConfigKey,
          _onChange = _this$props.onChange,
          options = _this$props.options,
          disabled = _this$props.disabled,
          id = _this$props.id,
          className = _this$props.className,
          style = _this$props.style,
          tabIndex = _this$props.tabIndex;
      return React.createElement(_synced.default, {
        globalConfigKey: globalConfigKey,
        render: (_ref) => {
          var value = _ref.value,
              canSetValue = _ref.canSetValue,
              setValue = _ref.setValue;

          if (value === undefined) {
            value = null;
          }

          (0, _invariant.default)(typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null, 'value should be a primitive type');
          return React.createElement(_select.default, {
            ref: el => this._select = el,
            disabled: disabled || !canSetValue,
            value: value,
            options: options,
            onChange: newValue => {
              if (newValue === undefined) {
                newValue = null;
              }

              setValue(newValue);

              if (_onChange) {
                _onChange(newValue);
              }
            },
            id: id,
            className: className,
            style: style,
            tabIndex: tabIndex,
            "aria-labelledby": this.props['aria-labelledby'],
            "aria-describedby": this.props['aria-describedby']
          });
        }
      });
    }
  }]);
  return SelectSynced;
}(React.Component);

(0, _defineProperty2.default)(SelectSynced, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsSyncedPropTypes);
var _default = SelectSynced;
exports.default = _default;