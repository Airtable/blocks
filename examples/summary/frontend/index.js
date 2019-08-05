import {initializeBlock, useBase, useRecords} from '@airtable/blocks/ui';
import React, {useState} from 'react';

const TABLE_NAME = 'Opportunities';

const FIELD_NAME = 'Estimated Value';

function SummaryBlock() {
    const base = useBase();

    const table = base.getTableByName(TABLE_NAME);

    const field = table.getFieldByName(FIELD_NAME);

    const records = useRecords(table.selectRecords({fields: [field]}));

    // `Field` objects have an `availableAggregators` property that
    // returns a list of aggregation functions that are valid for this
    // field type
    const availableAggregators = field.availableAggregators;

    return (
        <div style={{padding: 16}}>
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
        </div>
    );
}

function Aggregation({field, aggregator, records}) {
    // `aggregateToString()` returns a human-readable string for the
    // aggregate value. If you just want a number, you can call
    // `aggregate()`

    return (
        <div style={{marginBottom: 16}}>
            {aggregator.displayName}
            <div style={{fontSize: 14, fontWeight: 'bold'}}>
                {aggregator.aggregateToString(records, field)}
            </div>
        </div>
    );
}

initializeBlock(() => <SummaryBlock />);
