import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    TablePickerSynced,
    ViewPickerSynced,
    FieldPickerSynced,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';

import {Bar} from 'react-chartjs-2';

const GlobalConfigKeys = {
    TABLE_ID: 'tableId',
    VIEW_ID: 'viewId',
    X_FIELD_ID: 'xFieldId',
};

function SimpleChartBlock() {
    const base = useBase();
    const globalConfig = useGlobalConfig();

    const tableId = globalConfig.get(GlobalConfigKeys.TABLE_ID);
    const table = base.getTableByIdIfExists(tableId);

    const viewId = globalConfig.get(GlobalConfigKeys.VIEW_ID);
    const view = table ? table.getViewByIdIfExists(viewId) : null;

    const xFieldId = globalConfig.get(GlobalConfigKeys.X_FIELD_ID);
    const xField = table ? table.getFieldByIdIfExists(xFieldId) : null;

    const records = useRecords(view ? view.selectRecords() : null);

    const data = records && xField ? getChartData({records, xField}) : null;

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div style={{display: 'flex'}}>
                <Settings table={table} />
            </div>
            {data && (
                <div style={{position: 'relative', flexGrow: 1}}>
                    <Bar
                        data={data}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                        },
                                    },
                                ],
                            },
                            legend: {
                                display: false,
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
}

function getChartData({records, xField}) {
    const recordsByXValueString = new Map();
    for (const record of records) {
        const xValue = record.getCellValue(xField);
        const xValueString = xValue === null ? null : record.getCellValueAsString(xField);

        if (!recordsByXValueString.has(xValueString)) {
            recordsByXValueString.set(xValueString, [record]);
        } else {
            recordsByXValueString.get(xValueString).push(record);
        }
    }

    const labels = [];
    const points = [];
    for (const [xValueString, records] of recordsByXValueString.entries()) {
        const label = xValueString === null ? 'Empty' : xValueString;
        labels.push(label);
        points.push(records.length);
    }

    const data = {
        labels,
        datasets: [
            {
                backgroundColor: '#4380f1',
                data: points,
            },
        ],
    };
    return data;
}

function Settings({table}) {
    return (
        <React.Fragment>
            <Label text="Table">
                <TablePickerSynced globalConfigKey={GlobalConfigKeys.TABLE_ID} />
            </Label>
            {table && (
                <Label text="View">
                    <ViewPickerSynced table={table} globalConfigKey={GlobalConfigKeys.VIEW_ID} />
                </Label>
            )}
            {table && (
                <Label text="X-axis field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={GlobalConfigKeys.X_FIELD_ID}
                    />
                </Label>
            )}
        </React.Fragment>
    );
}

function Label({text, children}) {
    return (
        <label
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 8,
                flexGrow: 1,
                flexShrink: 0,
            }}
        >
            <p style={{fontWeight: 500, marginBottom: 8}}>{text}</p>
            {children}
        </label>
    );
}

initializeBlock(() => <SimpleChartBlock />);
