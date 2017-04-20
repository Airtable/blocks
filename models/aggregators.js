// @flow
const _ = require('client_server_shared/lodash.custom');
const liveappSummaryFunctions = require('client_server_shared/summary_functions');
const liveappSummaryFunctionKeyByAggregatorKey = require('client/blocks/sdk/models/liveapp_summary_function_key_by_aggregator_key');

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

    const opts: Object = {};
    if (liveappSummaryFunctions.isHistogram(aggregatorKey)) {
        opts.numBins = 10;
    }

    const values = records.map(record => {
        return record.__getRawCellValue(field.id);
    });

    return liveappSummaryFunctions.aggregateValues(
        aggregatorKey,
        field.__getRawType(),
        values,
        opts,
    );
};

for (const key of aggregatorKeys) {
    const liveappSummaryFunctionKey = liveappSummaryFunctionKeyByAggregatorKey[key];
    aggregators[key] = Object.freeze({
        key,
        displayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].menuDisplayName,
        shortDisplayName: liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey].cellDisplayName,
        aggregate: aggregate.bind(null, key),
    });
}

Object.freeze(aggregators);

module.exports = aggregators;
