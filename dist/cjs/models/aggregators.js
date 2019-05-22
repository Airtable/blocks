"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _liveapp_summary_function_key_by_aggregator_key = _interopRequireDefault(require("./liveapp_summary_function_key_by_aggregator_key"));

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

const liveappSummaryFunctions = window.__requirePrivateModuleFromAirtable('client_server_shared/summary_functions');
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


const aggregatorKeys = (0, _keys.default)(u).call(u, _liveapp_summary_function_key_by_aggregator_key.default);
const aggregators = {};

const aggregate = (aggregatorKey, records, field) => {
  if (!field.isAggregatorAvailable(aggregatorKey)) {
    throw new Error(`The ${aggregatorKey} aggregator is not available for ${field.config.type} fields`);
  }

  if (liveappSummaryFunctions.isNone(aggregatorKey)) {
    return null;
  }

  const values = (0, _map.default)(records).call(records, record => {
    return record.__getRawCellValue(field.id);
  });
  return liveappSummaryFunctions.aggregateValues(aggregatorKey, field.__getRawType(), field.__getRawTypeOptions(), (0, _get_sdk.default)().base.__appInterface, values, {});
};

const aggregateToString = (aggregatorKey, records, field) => {
  const summaryValue = aggregate(aggregatorKey, records, field);
  const summaryFunction = _liveapp_summary_function_key_by_aggregator_key.default[aggregatorKey];

  const columnType = field.__getRawFormulaicResultType() || field.__getRawType();

  return liveappSummaryFunctions.formatSummaryValueAsString(summaryFunction, summaryValue, columnType, field.__getRawTypeOptions(), (0, _get_sdk.default)().base.__appInterface);
};

for (const key of aggregatorKeys) {
  const liveappSummaryFunctionKey = _liveapp_summary_function_key_by_aggregator_key.default[key];
  aggregators[key] = (0, _freeze.default)({
    key,
    displayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].menuDisplayName,
    shortDisplayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].cellDisplayName,
    aggregate: (0, _bind.default)(aggregate).call(aggregate, null, key),
    aggregateToString: (0, _bind.default)(aggregateToString).call(aggregateToString, null, key)
  });
}

(0, _freeze.default)(aggregators);
var _default = aggregators;
exports.default = _default;