import {initializeBlock, useBase, useRecords, Box, Text} from '@airtable/blocks/ui';
import React from 'react';

const TABLE_NAME = 'Opportunities';

const FIELD_NAME = 'Estimated Value';

function SummaryApp() {
    const base = useBase();

    const table = base.getTableByName(TABLE_NAME);

    const field = table.getFieldByName(FIELD_NAME);

    // To avoid loading unnecessary data, we pass options to useRecords to only load cell values
    // for the field we are summarizing.
    const records = useRecords(table, {fields: [field]});

    // `Field` objects have an `availableAggregators` property that
    // returns a list of aggregation functions that are valid for this
    // field type
    const availableAggregators = field.availableAggregators;

    return (
        <Box padding={3}>
            {availableAggregators
                // Every field has a 'None' aggregator which outputs a
                // blank. It's not very interesting to look at, so we
                // filter it out.
                .filter(aggregator => aggregator.key !== 'none')
                .map((aggregator, key) => (
                    <Aggregation
                        key={key}
                        field={field}
                        aggregator={aggregator}
                        records={records}
                    />
                ))}
        </Box>
    );
}

function Aggregation({field, aggregator, records}) {
    // `aggregateToString()` returns a human-readable string for the
    // aggregate value. If you just want a number, you can call
    // `aggregate()`

    return (
        <Box marginBottom={3}>
            <Text size="small" textColor="light">
                {aggregator.displayName}
            </Text>
            <Text fontWeight="strong">{aggregator.aggregateToString(records, field)}</Text>
        </Box>
    );
}

initializeBlock(() => <SummaryApp />);
