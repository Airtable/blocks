// @flow
import getSdk from '../get_sdk';
import {spawnError} from '../error_utils';
import liveappSummaryFunctionKeyByAggregatorKey from './liveapp_summary_function_key_by_aggregator_key';
import type Record from './record';
import type Field from './field';

const liveappSummaryFunctions = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/summary_functions',
);

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
export type Aggregator = {
    key: string,
    displayName: string,
    shortDisplayName: string,

    aggregate: (records: Array<Record>, field: Field) => mixed,
    aggregateToString: (records: Array<Record>, field: Field) => string,
};

const aggregatorKeys = Object.keys(liveappSummaryFunctionKeyByAggregatorKey);

const aggregators: {[string]: Aggregator} = {};

const aggregate = (aggregatorKey: string, records: Array<Record>, field: Field) => {
    if (!field.isAggregatorAvailable(aggregatorKey)) {
        throw spawnError(
            'The %s aggregator is not available for %s fields',
            aggregatorKey,
            field.type,
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
        getSdk().__appInterface,
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
        getSdk().__appInterface,
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

export default aggregators;
