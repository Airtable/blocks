"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _liveapp_summary_function_key_by_aggregator_key = _interopRequireDefault(require("./liveapp_summary_function_key_by_aggregator_key"));

var liveappSummaryFunctions = window.__requirePrivateModuleFromAirtable('client_server_shared/summary_functions');
/**
 * Aggregators can be used to compute aggregates for cell values.
 *
 * @example
 * // To get a list of aggregators supported for a specific field:
 * const aggregators = myField.availableAggregators;
 *
 * // To compute the total attachment size of an attachment field:
 * import {models} from 'airtable-block';
 * const aggregator = models.aggregators.totalAttachmentSize;
 * const value = aggregator.aggregate(myRecords, myAttachmentField);
 * const valueAsString = aggregate.aggregateToString(myRecords, myAttachmentField);
 */


var aggregatorKeys = (0, _keys.default)(_liveapp_summary_function_key_by_aggregator_key.default);
var aggregators = {};

var aggregate = function aggregate(aggregatorKey, records, field) {
  if (!field.isAggregatorAvailable(aggregatorKey)) {
    var _context;

    throw new Error((0, _concat.default)(_context = "The ".concat(aggregatorKey, " aggregator is not available for ")).call(_context, field.type, " fields"));
  }

  if (liveappSummaryFunctions.isNone(aggregatorKey)) {
    return null;
  }

  var values = (0, _map.default)(records).call(records, function (record) {
    return record.__getRawCellValue(field.id);
  });
  return liveappSummaryFunctions.aggregateValues(aggregatorKey, field.__getRawType(), field.__getRawTypeOptions(), (0, _get_sdk.default)().base.__appInterface, values, {});
};

var aggregateToString = function aggregateToString(aggregatorKey, records, field) {
  var summaryValue = aggregate(aggregatorKey, records, field);
  var summaryFunction = _liveapp_summary_function_key_by_aggregator_key.default[aggregatorKey];

  var columnType = field.__getRawFormulaicResultType() || field.__getRawType();

  return liveappSummaryFunctions.formatSummaryValueAsString(summaryFunction, summaryValue, columnType, field.__getRawTypeOptions(), (0, _get_sdk.default)().base.__appInterface);
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = (0, _getIterator2.default)(aggregatorKeys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var key = _step.value;
    var liveappSummaryFunctionKey = _liveapp_summary_function_key_by_aggregator_key.default[key];
    aggregators[key] = (0, _freeze.default)({
      key: key,
      displayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].menuDisplayName,
      shortDisplayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].cellDisplayName,
      aggregate: (0, _bind.default)(aggregate).call(aggregate, null, key),
      aggregateToString: (0, _bind.default)(aggregateToString).call(aggregateToString, null, key)
    });
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

(0, _freeze.default)(aggregators);
var _default = aggregators;
exports.default = _default;