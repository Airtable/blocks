import {
    initializeBlock,
    useBase,
    useRecords,
    useWatchable,
    expandRecord,
    TablePickerSynced,
    FieldPickerSynced,
    ViewPickerSynced,
    Button,
} from '@airtable/blocks/ui';
import {globalConfig, models} from '@airtable/blocks';
import React from 'react';

function getCheckboxField(table, fieldId) {
    const field = table.getFieldByIdIfExists(fieldId);
    if (!field) {
        // The field doesn't exist.
        return null;
    }
    if (field.type !== models.fieldTypes.CHECKBOX) {
        // Non-checkbox fields aren't supported.
        return null;
    }
    return field;
}

function TodoBlock() {
    const base = useBase();

    // Read the user's choice for which table, view,
    // and field to use from globalConfig.
    useWatchable(globalConfig, ['selectedTableId', 'selectedViewId', 'selectedDoneFieldId']);
    const tableId = globalConfig.get('selectedTableId');
    const viewId = globalConfig.get('selectedViewId');
    const doneFieldId = globalConfig.get('selectedDoneFieldId');

    const table = base.getTableByIdIfExists(tableId);
    const view = table ? table.getViewByIdIfExists(viewId) : null;
    const doneField = table ? getCheckboxField(table, doneFieldId) : null;

    // Get the records from the view.
    const queryResult = view ? view.selectRecords() : null;
    const records = useRecords(queryResult);

    const tasks = records
        ? records.map(record => {
              return <Task key={record.id} record={record} doneField={doneField} />;
          })
        : null;

    return (
        <div>
            <TablePickerSynced globalConfigKey="selectedTableId" />
            <ViewPickerSynced table={table} globalConfigKey="selectedViewId" />
            <FieldPickerSynced
                table={table}
                shouldAllowPickingNone={true}
                allowedTypes={[models.fieldTypes.CHECKBOX]}
                globalConfigKey="selectedDoneFieldId"
            />
            {table ? (
                <div style={{padding: 12}}>
                    <Button
                        theme={Button.themes.BLUE}
                        disabled={!table.canCreateRecord()}
                        onClick={() => {
                            const {record} = table.createRecord();
                            expandRecord(record);
                        }}
                    >
                        Create record
                    </Button>
                </div>
            ) : null}
            {tasks}
        </div>
    );
}

function Task({record, doneField}) {
    return (
        <div style={{fontSize: 18, padding: 12, borderBottom: '1px solid #ddd'}}>
            {doneField ? (
                <input
                    type="checkbox"
                    checked={record.getCellValue(doneField) ? true : false}
                    disabled={!record.canSetCellValue(doneField)}
                    onClick={event => {
                        record.setCellValue(doneField, event.target.checked);
                    }}
                />
            ) : null}
            <a
                style={{cursor: 'pointer'}}
                onClick={() => {
                    expandRecord(record);
                }}
            >
                {record.primaryCellValueAsString || 'Unnamed record'}
            </a>
        </div>
    );
}

initializeBlock(() => <TodoBlock />);
