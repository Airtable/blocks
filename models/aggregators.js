// @flow
const _ = require('client_server_shared/lodash.custom');
const liveappSummaryFunctions = require('client_server_shared/summary_functions');
const liveappSummaryFunctionKeyByAggregatorKey = require('client/blocks/sdk/models/liveapp_summary_function_key_by_aggregator_key');
const getSdk = require('client/blocks/sdk/get_sdk');

import type RecordType from 'client/blocks/sdk/models/record';
import type FieldType from 'client/blocks/sdk/models/field';

export type Aggregator = {
    key: string,
    displayName: string,
    shortDisplayName: string,

    // TODO(jb): add better flow types for the result of these functions. This would
    // require manually defining each aggregation function below rather than doing it
    // dynamically on load.
    aggregate: (records: Array<RecordType>, field: FieldType) => mixed,
    aggregateToString: (records: Array<RecordType>, field: FieldType) => string,
};

const aggregatorKeys = _.keys(liveappSummaryFunctionKeyByAggregatorKey);

const aggregators: {[key: string]: Aggregator} = {};

const aggregate = (aggregatorKey: string, records: Array<RecordType>, field: FieldType) => {
    if (!field.isAggregatorAvailable(aggregatorKey)) {
        throw new Error(`The ${aggregatorKey} aggregator is not available for ${field.config.type} fields`);
    }

    if (liveappSummaryFunctions.isNone(aggregatorKey)) {
        return null;
    }

    const values = records.map(record => {
        return record.__getRawCellValue(field.id);
    });

    return liveappSummaryFunctions.aggregateValues(
        aggregatorKey,
        field.__getRawType(),
        values,
        {},
    );
};

const aggregateToString = (aggregatorKey: string, records: Array<RecordType>, field: FieldType) => {
    const summaryValue = aggregate(aggregatorKey, records, field);
    const summaryFunction = liveappSummaryFunctionKeyByAggregatorKey[aggregatorKey];
    const columnType = field.__getRawFormulaicResultType() || field.__getRawType();
    return liveappSummaryFunctions.formatSummaryValueAsString(
        summaryFunction,
        summaryValue,
        columnType,
        field.__getRawTypeOptions(),
        getSdk().base.__appBlanket,
    );
};

for (const key of aggregatorKeys) {
    const liveappSummaryFunctionKey = liveappSummaryFunctionKeyByAggregatorKey[key];
    aggregators[key] = Object.freeze({
        key,
        displayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].menuDisplayName,
        shortDisplayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].cellDisplayName,
        aggregate: aggregate.bind(null, key),
        aggregateToString: aggregateToString.bind(null, key),
    });
}

Object.freeze(aggregators);

module.exports = aggregators;
