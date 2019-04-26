// @flow
const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');
const liveappSummaryFunctions = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/summary_functions',
);
const liveappSummaryFunctionKeyByAggregatorKey = require('block_sdk/shared/models/liveapp_summary_function_key_by_aggregator_key');
const getSdk = require('block_sdk/shared/get_sdk');

import type Record from 'block_sdk/shared/models/record';
import type Field from 'block_sdk/shared/models/field';

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
export type Aggregator = {
    key: string,
    displayName: string,
    shortDisplayName: string,

    // TODO(jb): add better flow types for the result of these functions. This would
    // require manually defining each aggregation function below rather than doing it
    // dynamically on load.
    aggregate: (records: Array<Record>, field: Field) => mixed,
    aggregateToString: (records: Array<Record>, field: Field) => string,
};

const aggregatorKeys = u.keys(liveappSummaryFunctionKeyByAggregatorKey);

const aggregators: {[string]: Aggregator} = {};

const aggregate = (aggregatorKey: string, records: Array<Record>, field: Field) => {
    if (!field.isAggregatorAvailable(aggregatorKey)) {
        throw new Error(
            `The ${aggregatorKey} aggregator is not available for ${field.config.type} fields`,
        );
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
        field.__getRawTypeOptions(),
        getSdk().base.__appInterface,
        values,
        {},
    );
};

const aggregateToString = (aggregatorKey: string, records: Array<Record>, field: Field) => {
    const summaryValue = aggregate(aggregatorKey, records, field);
    const summaryFunction = liveappSummaryFunctionKeyByAggregatorKey[aggregatorKey];
    const columnType = field.__getRawFormulaicResultType() || field.__getRawType();
    return liveappSummaryFunctions.formatSummaryValueAsString(
        summaryFunction,
        summaryValue,
        columnType,
        field.__getRawTypeOptions(),
        getSdk().base.__appInterface,
    );
};

for (const key of aggregatorKeys) {
    const liveappSummaryFunctionKey = liveappSummaryFunctionKeyByAggregatorKey[key];
    aggregators[key] = Object.freeze({
        key,
        displayName:
            liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey]
                .menuDisplayName,
        shortDisplayName:
            liveappSummaryFunctions.summaryFunctionConfigs[liveappSummaryFunctionKey]
                .cellDisplayName,
        aggregate: aggregate.bind(null, key),
        aggregateToString: aggregateToString.bind(null, key),
    });
}

Object.freeze(aggregators);

module.exports = aggregators;
