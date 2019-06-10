"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _liveapp_summary_function_key_by_aggregator_key = _interopRequireDefault(require("./liveapp_summary_function_key_by_aggregator_key"));

var liveappSummaryFunctions = window.__requirePrivateModuleFromAirtable('client_server_shared/summary_functions');
/**
 * Aggregators can be used to compute aggregates for cell values.
 *
 * @example
 * // To get a list of aggregators supported for a specific field:
 * const fieldAggregators = myField.availableAggregators;
 *
 * // To compute the total attachment size of an attachment field:
 * import {aggregators} from '@airtable/blocks/models';
 * const aggregator = aggregators.totalAttachmentSize;
 * const value = aggregator.aggregate(myRecords, myAttachmentField);
 * const valueAsString = aggregate.aggregateToString(myRecords, myAttachmentField);
 */


var aggregatorKeys = Object.keys(_liveapp_summary_function_key_by_aggregator_key.default);
var aggregators = {};

var aggregate = (aggregatorKey, records, field) => {
  if (!field.isAggregatorAvailable(aggregatorKey)) {
    throw new Error("The ".concat(aggregatorKey, " aggregator is not available for ").concat(field.type, " fields"));
  }

  if (liveappSummaryFunctions.isNone(aggregatorKey)) {
    return null;
  }

  var values = records.map(record => {
    return record.__getRawCellValue(field.id);
  });
  return liveappSummaryFunctions.aggregateValues(aggregatorKey, field.__getRawType(), field.__getRawTypeOptions(), (0, _get_sdk.default)().base.__appInterface, values, {});
};

var aggregateToString = (aggregatorKey, records, field) => {
  var summaryValue = aggregate(aggregatorKey, records, field);
  var summaryFunction = _liveapp_summary_function_key_by_aggregator_key.default[aggregatorKey];

  var columnType = field.__getRawFormulaicResultType() || field.__getRawType();

  return liveappSummaryFunctions.formatSummaryValueAsString(summaryFunction, summaryValue, columnType, field.__getRawTypeOptions(), (0, _get_sdk.default)().base.__appInterface);
};

for (var _i = 0, _aggregatorKeys = aggregatorKeys; _i < _aggregatorKeys.length; _i++) {
  var key = _aggregatorKeys[_i];
  var liveappSummaryFunctionKey = _liveapp_summary_function_key_by_aggregator_key.default[key];
  aggregators[key] = Object.freeze({
    key,
    displayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].menuDisplayName,
    shortDisplayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].cellDisplayName,
    aggregate: aggregate.bind(null, key),
    aggregateToString: aggregateToString.bind(null, key)
  });
}

Object.freeze(aggregators);
var _default = aggregators;
exports.default = _default;