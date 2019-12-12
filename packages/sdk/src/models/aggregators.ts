/** @module @airtable/blocks/models: Aggregators */ /** */
import getSdk from '../get_sdk';
import {AggregatorKey} from '../types/aggregators';
import airtableInterface from '../injected/airtable_interface';
import {spawnError} from '../error_utils';
import Record from './record';
import Field from './field';

/**
 * Aggregators can be used to compute aggregates for cell values.
 *
 * @example
 * ```js
 * import {aggregators} from '@airtable/blocks/models';
 *
 * // To get a list of aggregators supported for a specific field:
 * const fieldAggregators = myField.availableAggregators;
 *
 * // To compute the total attachment size of an attachment field:
 * const aggregator = aggregators.totalAttachmentSize;
 * const value = aggregator.aggregate(myRecords, myAttachmentField);
 * const valueAsString = aggregate.aggregateToString(myRecords, myAttachmentField);
 * ```
 * @docsPath models/advanced/Aggregator
 */
export interface Aggregator {
    /** A unique key for this aggregator that can be used to identify it in code. */
    key: AggregatorKey;
    /** A user friendly name for this aggregator that can be displayed to users. */
    displayName: string;
    /** A short user friendly name for this aggregator that can be displayed to users. */
    shortDisplayName: string;

    /** Aggregates the value of `field` in each of `records` to produce a single value. */
    aggregate(records: Array<Record>, field: Field): unknown;
    /** Aggregates the value of `field` in each of `records` to produce a single value, formatted as a string. */
    aggregateToString(records: Array<Record>, field: Field): string;
}

const aggregate = (aggregatorKey: AggregatorKey, records: Array<Record>, field: Field) => {
    if (!field.isAggregatorAvailable(aggregatorKey)) {
        throw spawnError(
            'The %s aggregator is not available for %s fields',
            aggregatorKey,
            field.type,
        );
    }

    const appInterface = getSdk().__appInterface;
    const cellValues = records.map(record => record.getCellValue(field));
    return airtableInterface.aggregators.aggregate(
        appInterface,
        aggregatorKey,
        cellValues,
        field._data,
    );
};

const aggregateToString = (aggregatorKey: AggregatorKey, records: Array<Record>, field: Field) => {
    if (!field.isAggregatorAvailable(aggregatorKey)) {
        throw spawnError(
            'The %s aggregator is not available for %s fields',
            aggregatorKey,
            field.type,
        );
    }

    const appInterface = getSdk().__appInterface;
    const cellValues = records.map(record => record.getCellValue(field));
    return airtableInterface.aggregators.aggregateToString(
        appInterface,
        aggregatorKey,
        cellValues,
        field._data,
    );
};

const aggregators: {[key: string]: Aggregator} = {};
const aggregatorKeys = airtableInterface.aggregators.getAllAvailableAggregatorKeys();

for (const key of aggregatorKeys) {
    const config = airtableInterface.aggregators.getAggregatorConfig(key);
    aggregators[key] = Object.freeze({
        key,
        displayName: config.displayName,
        shortDisplayName: config.shortDisplayName,
        aggregate: aggregate.bind(null, key),
        aggregateToString: aggregateToString.bind(null, key),
    });
}

Object.freeze(aggregators);

export default aggregators;
