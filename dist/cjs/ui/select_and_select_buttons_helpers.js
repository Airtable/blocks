"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionValueToString = optionValueToString;
exports.stringToOptionValue = stringToOptionValue;
exports.validateOptions = exports.SelectAndSelectButtonsSyncedPropTypes = exports.SelectAndSelectButtonsPropTypes = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var SelectOptionValueProp = _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool]);

var SelectAndSelectButtonsPropTypes = {
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
var SelectAndSelectButtonsSyncedPropTypes = {
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

var validateOptions = options => {
  if (options) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var option = _step.value;

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
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  return {
    isValid: true
  };
};

exports.validateOptions = validateOptions;

function optionValueToString(value) {
  var valueJson = JSON.stringify(value === undefined ? {
    isUndefined: true
  } : {
    notUndefinedValue: value
  });
  return valueJson;
}

function stringToOptionValue(valueJson) {
  var parsed = JSON.parse(valueJson);
  var value = parsed.isUndefined ? undefined : parsed.notUndefinedValue;
  return value;
}