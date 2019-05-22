"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.optionValueToString = optionValueToString;
exports.stringToOptionValue = stringToOptionValue;
exports.validateOptions = exports.SelectAndSelectButtonsSyncedPropTypes = exports.SelectAndSelectButtonsPropTypes = void 0;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

const SelectOptionValueProp = _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool]);

const SelectAndSelectButtonsPropTypes = {
  onChange: _propTypes.default.func,
  value: SelectOptionValueProp,
  // We do more strict checks in render.
  options: _propTypes.default.arrayOf(_propTypes.default.shape({
    value: SelectOptionValueProp,
    label: _propTypes.default.node,
    disabled: _propTypes.default.bool
  })).isRequired,
  disabled: _propTypes.default.bool,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};
exports.SelectAndSelectButtonsPropTypes = SelectAndSelectButtonsPropTypes;
const SelectAndSelectButtonsSyncedPropTypes = {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  options: _propTypes.default.arrayOf(_propTypes.default.shape({
    value: SelectOptionValueProp,
    label: _propTypes.default.node,
    disabled: _propTypes.default.bool
  })).isRequired,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};
exports.SelectAndSelectButtonsSyncedPropTypes = SelectAndSelectButtonsSyncedPropTypes;

const validateOptions = options => {
  if (options) {
    for (const option of options) {
      // These are hard errors because we can't guarantee that other values
      // will be JSON-encodable. And undefined gets coerced to the string
      // "undefined" which is confusing.
      if (typeof option.value === 'object' && option.value !== null) {
        return {
          isValid: false,
          reason: 'option value must be a string, number, boolean, null, or undefined. Got an object.'
        };
      }
    }
  }

  return {
    isValid: true
  };
};

exports.validateOptions = validateOptions;

function optionValueToString(value) {
  const valueJson = (0, _stringify.default)(value === undefined ? {
    isUndefined: true
  } : {
    notUndefinedValue: value
  });
  return valueJson;
}

function stringToOptionValue(valueJson) {
  const parsed = JSON.parse(valueJson);
  const value = parsed.isUndefined ? undefined : parsed.notUndefinedValue;
  return value;
}