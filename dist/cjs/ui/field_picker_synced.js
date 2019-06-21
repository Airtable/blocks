"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

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

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _table = _interopRequireDefault(require("../models/table"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _field = require("../types/field");

var _private_utils = require("../private_utils");

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _field_picker = _interopRequireDefault(require("./field_picker"));

var _synced = _interopRequireDefault(require("./synced"));

var _with_hooks = _interopRequireDefault(require("./with_hooks"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

/**
 * Dropdown menu component for selecting fields, synced with {@link GlobalConfig}.
 *
 * @example
 * import {TablePickerSynced, FieldPickerSynced, useBase, useWatchable} from '@airtable/blocks/ui';
 * import {fieldTypes} from '@airtable/blocks/models';
 * import {globalConfig} from '@airtable/blocks';
 * import React, {Fragment} from 'react';
 *
 * function Block() {
 *     const base = useBase();
 *     const tableId = globalConfig.get('tableId');
 *     const table = base.getTableByIdIfExists(tableId);
 *     const fieldId = globalConfig.get('fieldId');
 *     const field = table.getFieldByIdIfExists(fieldId);
 *     useWatchable(globalConfig, ['tableId', 'fieldId']);
 *
 *     const summaryText = field ? `The field type for ${field.name} is ${field.type}.` : 'No field selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label style={{display: 'block', marginBottom: 16}}>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePickerSynced
 *                     globalConfigKey='tableId'
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *             {table && (
 *                 <label>
 *                     <div style={{marginBottom: 8, fontWeight: 500}}>Field</div>
 *                     <FieldPickerSynced
 *                         table={table}
 *                         globalConfigKey='fieldId'
 *                         allowedTypes={[
 *                             fieldTypes.SINGLE_LINE_TEXT,
 *                             fieldTypes.MULTILINE_TEXT,
 *                             fieldTypes.EMAIL,
 *                             fieldTypes.URL,
 *                             fieldTypes.PHONE_NUMBER,
 *                         ]}
 *                         shouldAllowPickingNone={true}
 *                     />
 *                 </label>
 *             )}
 *         </Fragment>
 *     );
 * }
 */
var FieldPickerSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(FieldPickerSynced, _React$Component);

  function FieldPickerSynced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, FieldPickerSynced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FieldPickerSynced).call(this, props)); // TODO (stephen): Use React.forwardRef

    _this._fieldPicker = null;
    return _this;
  }

  (0, _createClass2.default)(FieldPickerSynced, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._fieldPicker, 'No field picker to focus');

      this._fieldPicker.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._fieldPicker, 'No field picker to blur');

      this._fieldPicker.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._fieldPicker, 'No field picker to click');

      this._fieldPicker.click();
    }
  }, {
    key: "_getFieldFromGlobalConfigValue",
    value: function _getFieldFromGlobalConfigValue(fieldId) {
      var table = this.props.table;

      if (!table || table.isDeleted) {
        return null;
      }

      return typeof fieldId === 'string' && table ? table.getFieldByIdIfExists(fieldId) : null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          table = _this$props.table,
          globalConfigKey = _this$props.globalConfigKey,
          _onChange = _this$props.onChange,
          disabled = _this$props.disabled,
          allowedTypes = _this$props.allowedTypes,
          shouldAllowPickingNone = _this$props.shouldAllowPickingNone,
          placeholder = _this$props.placeholder,
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
          return React.createElement(_field_picker.default, {
            ref: el => this._fieldPicker = el,
            table: table,
            field: this._getFieldFromGlobalConfigValue(value),
            onChange: field => {
              setValue(field ? field.id : null);

              if (_onChange) {
                _onChange(field);
              }
            },
            disabled: disabled || !canSetValue,
            allowedTypes: allowedTypes,
            shouldAllowPickingNone: shouldAllowPickingNone,
            placeholder: placeholder,
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
  return FieldPickerSynced;
}(React.Component);

(0, _defineProperty2.default)(FieldPickerSynced, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  // Passed through to FieldPicker:
  allowedTypes: _propTypes.default.arrayOf(_propTypes.default.oneOf((0, _private_utils.values)(_field.FieldTypes))),
  shouldAllowPickingNone: _propTypes.default.bool,
  placeholder: _propTypes.default.string,
  id: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOf([_propTypes.default.number, _propTypes.default.string]),
  'aria-labelledby': _propTypes.default.string,
  'aria-describedby': _propTypes.default.string
});

var _default = (0, _with_hooks.default)(FieldPickerSynced, props => {
  (0, _use_watchable.default)((0, _get_sdk.default)().base, ['tables']);
  (0, _use_watchable.default)(props.table, ['fields']);
  return {};
});

exports.default = _default;