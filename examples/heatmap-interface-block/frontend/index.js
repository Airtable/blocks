import React from 'react';
import {FieldType} from '@airtable/blocks/interface/models';
import {
    expandRecord,
    initializeBlock,
    useCustomProperties,
    useBase,
    useRecords,
} from '@airtable/blocks/interface/ui';
import './style.css';

function Heatmap() {
    const base = useBase();
    const table = base.tables[0]; // Every base has at least one table
    const records = useRecords(table);

    const {customPropertyValueByKey} = useCustomProperties(
        // This should be a function with a stable identity, i.e. defined outside of the
        // component or wrapped in useCallback.
        getCustomProperties,
    );
    const xAxisField = customPropertyValueByKey['heatmap_x_axis'];
    const yAxisField = customPropertyValueByKey['heatmap_y_axis'];
    const valueField = customPropertyValueByKey['heatmap_value'];

    if (!xAxisField || !yAxisField || !valueField) {
        return (
            <div
                style={{
                    padding: '20px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                }}
            >
                Please configure the heatmap
            </div>
        );
    }

    const recordsGroupedByYAxis = {};
    for (const record of records) {
        const YAxisValue = record.getCellValueAsString(yAxisField);
        if (!recordsGroupedByYAxis[YAxisValue]) {
            recordsGroupedByYAxis[YAxisValue] = [];
        }
        recordsGroupedByYAxis[YAxisValue].push(record);
    }

    // Find the maximum value for color scaling
    const maxValue = Math.max(
        ...Object.values(recordsGroupedByYAxis).map(_records =>
            Math.max(
                ...Object.values(_records).map(record => Math.abs(record.getCellValue(valueField))),
            ),
        ),
    );

    // Define a function to calculate color based on population change
    const getColor = value => {
        if (value === 0) {
            return '#eeeeee';
        } else if (value > 0) {
            const alpha = Math.abs(value) / maxValue;
            return `rgba(0, 128, 0, ${alpha})`;
        } else {
            const alpha = Math.abs(value) / maxValue;
            return `rgba(128, 0, 0, ${alpha})`;
        }
    };

    const xAxisValues = Array.from(
        new Set(records.map(record => record.getCellValueAsString(xAxisField))),
    ).sort();
    const yAxisValues = Object.keys(recordsGroupedByYAxis).sort();

    return (
        <table>
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    {xAxisValues.map(xAxisValue => {
                        return (
                            <th
                                key={xAxisValue}
                                style={{verticalAlign: 'bottom', textAlign: 'center'}}
                            >
                                <span
                                    style={{
                                        writingMode: 'vertical-rl',
                                        transform: 'rotate(180deg)',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {xAxisValue}
                                </span>
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {yAxisValues.map(yAxisValue => (
                    <tr key={yAxisValue}>
                        <td style={{textAlign: 'center'}}>{yAxisValue}</td>
                        {xAxisValues.map(xAxisValue => {
                            const _records = recordsGroupedByYAxis[yAxisValue];
                            const record = _records.find(
                                record => record.getCellValueAsString(xAxisField) === xAxisValue,
                            );
                            const value = record ? record.getCellValue(valueField) : 0;
                            const cellColor = getColor(value);
                            return (
                                <td
                                    key={`${yAxisValue}-${xAxisValue}`}
                                    style={{
                                        backgroundColor: cellColor,
                                        minWidth: 1,
                                        minHeight: 1,
                                    }}
                                    title={value.toLocaleString()}
                                    onClick={record ? () => expandRecord(record) : undefined}
                                ></td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function getCustomProperties(base) {
    const table = base.tables[0]; // Every base has at least one table

    const fieldTypesForAxes = new Set([FieldType.SINGLE_SELECT, FieldType.MULTIPLE_RECORD_LINKS]);
    const fieldTypesForValue = new Set([FieldType.NUMBER, FieldType.PERCENT]);

    return [
        {
            key: 'heatmap_x_axis',
            label: 'X Axis',
            type: 'field',
            table,
            possibleValues: table.fields.filter(field => fieldTypesForAxes.has(field.type)),
        },
        {
            key: 'heatmap_y_axis',
            label: 'Y Axis',
            type: 'field',
            table,
            possibleValues: table.fields.filter(field => fieldTypesForAxes.has(field.type)),
        },
        {
            key: 'heatmap_value',
            label: 'Value',
            type: 'field',
            table,
            possibleValues: table.fields.filter(field => fieldTypesForValue.has(field.type)),
        },
    ];
}

initializeBlock({interface: () => <Heatmap />});
