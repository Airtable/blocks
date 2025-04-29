/** @module @airtable/blocks/models: Aggregators */ /** */
import {AggregatorKey} from '../types/aggregators';
import {spawnError} from '../../shared/error_utils';
import Sdk from '../sdk';
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
 * @docsPath models/Aggregator
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

/**
 * Note: this is hidden instead of internal as it is the type of the public models.aggregators.
 *
 * If its internal, typescript won't know about it since the types will be stripped, and typescript
 * blocks will error due to incomplete type definitions.
 *
 * @hidden
 */
export interface Aggregators {
    [key: string]: Aggregator;
}

const aggregate = (aggregatorKey: AggregatorKey, records: Array<Record>, field: Field) => {
    if (!field.isAggregatorAvailable(aggregatorKey)) {
        throw spawnError(
            'The %s aggregator is not available for %s fields',
            aggregatorKey,
            field.type,
        );
    }

    const {__appInterface: appInterface, __airtableInterface: airtableInterface} = sdk;
    const cellValues = records.map(record => record._getRawCellValue(field));
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

    const {__appInterface: appInterface, __airtableInterface: airtableInterface} = sdk;
    const cellValues = records.map(record => record._getRawCellValue(field));
    return airtableInterface.aggregators.aggregateToString(
        appInterface,
        aggregatorKey,
        cellValues,
        field._data,
    );
};

/**
 * Note: this is hidden instead of internal as it is used to determine the type of the public
 * models.aggregators.
 *
 * If its internal, typescript won't know about it since the types will be stripped, and typescript
 * blocks will error due to incomplete type definitions.
 *
 * TODO: this should be made less brittle.
 *
 * @hidden
 */
export default function createAggregators() {
    const {__airtableInterface: airtableInterface} = sdk;
    const aggregators: Aggregators = {};
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

    return aggregators;
}

let sdk: Sdk;

export function __injectSdkIntoCreateAggregators(_sdk: Sdk) {
    sdk = _sdk;
}
