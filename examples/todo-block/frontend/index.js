import React, {useState} from 'react';
import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    expandRecord,
    TablePickerSynced,
    ViewPickerSynced,
    FieldPickerSynced,
    Input,
    Button,
    Icon,
} from '@airtable/blocks/ui';
import {fieldTypes} from '@airtable/blocks/models';

function TodoBlock() {
    const base = useBase();

    // Read the user's choice for which table and view to use from globalConfig.
    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    const viewId = globalConfig.get('selectedViewId');
    const doneFieldId = globalConfig.get('selectedDoneFieldId');

    const table = base.getTableByIdIfExists(tableId);
    const view = table ? table.getViewByIdIfExists(viewId) : null;
    const doneField = table ? table.getFieldByIdIfExists(doneFieldId) : null;

    const queryResult =
        view && doneField ? view.selectRecords({fields: [table.primaryField, doneField]}) : null;
    const records = useRecords(queryResult);

    const tasks = records
        ? records.map(record => {
              return <Task key={record.id} record={record} table={table} doneField={doneField} />;
          })
        : null;

    return (
        <div>
            <TablePickerSynced globalConfigKey="selectedTableId" />
            <ViewPickerSynced table={table} globalConfigKey="selectedViewId" />
            <FieldPickerSynced
                table={table}
                globalConfigKey="selectedDoneFieldId"
                placeholder="Pick a 'done' field..."
                allowedTypes={[fieldTypes.CHECKBOX]}
            />
            {tasks}
            {table && doneField && <AddTaskForm table={table} />}
        </div>
    );
}

function Task({record, table, doneField}) {
    return (
        <div
            style={{
                fontSize: 18,
                padding: 8,
                borderBottom: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <TaskDoneCheckbox table={table} record={record} doneField={doneField} />
            <a
                style={{cursor: 'pointer', flex: 'auto', padding: 8}}
                onClick={() => {
                    expandRecord(record);
                }}
            >
                {record.primaryCellValueAsString || 'Unnamed record'}
            </a>
            <TaskDeleteButton table={table} record={record} />
        </div>
    );
}

function TaskDoneCheckbox({table, record, doneField}) {
    function onChange(event) {
        table.updateRecordAsync(record, {
            [doneField.id]: event.currentTarget.checked,
        });
    }

    const permissionCheck = table.checkPermissionsForUpdateRecord(record, {
        [doneField.id]: undefined,
    });

    return (
        <input
            type="checkbox"
            checked={!!record.getCellValue(doneField)}
            onChange={onChange}
            style={{marginRight: 8}}
            disabled={!permissionCheck.hasPermission}
        />
    );
}

function TaskDeleteButton({table, record}) {
    function onClick() {
        table.deleteRecordAsync(record);
    }

    return (
        <Button
            theme={Button.themes.TRANSPARENT}
            style={{marginLeft: 8}}
            onClick={onClick}
            disabled={!table.hasPermissionToDeleteRecord(record)}
        >
            <Icon name="x" />
        </Button>
    );
}

function AddTaskForm({table}) {
    const [taskName, setTaskName] = useState('');

    function onInputChange(event) {
        setTaskName(event.currentTarget.value);
    }

    function onSubmit(event) {
        event.preventDefault();
        table.createRecordAsync({
            [table.primaryField.id]: taskName,
        });
        setTaskName('');
    }

    // check whether or not the user is allowed to create records with values in the primary field.
    // if not, disable the form.
    const isFormEnabled = table.hasPermissionToCreateRecord({
        [table.primaryField.id]: undefined,
    });
    return (
        <form style={{margin: 8, display: 'flex'}} onSubmit={onSubmit}>
            <Input
                style={{flex: 'auto'}}
                value={taskName}
                onChange={onInputChange}
                disabled={!isFormEnabled}
            />
            <Button style={{marginLeft: 8}} type="submit" disabled={!isFormEnabled}>
                Add
            </Button>
        </form>
    );
}

initializeBlock(() => <TodoBlock />);
