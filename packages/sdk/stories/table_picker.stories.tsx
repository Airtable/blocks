import React, {useState} from 'react';
import Select, {selectStylePropTypes} from '../src/ui/select';
import {keys} from '../src/private_utils';
import theme from '../src/ui/theme/default_theme';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';
import {TablePicker} from '../src/ui/ui';

export default {
    component: TablePicker,
};

const tableOptions = ['Tasks', 'Projects', 'Teams'].map(value => ({
    value,
    label: value,
}));
const fieldOptions = ['Name', 'Notes', 'Attachments'].map(value => ({
    value,
    label: value,
}));

const sharedModelPickerExampleProps = {
    options: {
        size: {
            type: 'selectButtons',
            label: 'Size',
            options: keys(theme.selectSizes),
            defaultValue: 'default',
        },
        disabled: {
            type: 'switch',
            label: 'Disabled',
            defaultValue: false,
        },
        shouldAllowPickingNone: {
            type: 'switch',
            label: 'Allow empty selection',
            defaultValue: false,
        },
    },
    styleProps: Object.keys(selectStylePropTypes),
} as const;

function TablePickerExample() {
    const [value, setValue] = useState<null | string>(null);
    return (
        <Example
            {...sharedModelPickerExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React, {useState} from 'react';
                    import {TablePicker} from '@airtable/blocks/ui';

                    const TablePickerExample = () => {
                        const [table, setTable] = useState(null);

                        return <TablePicker table={table} onChange={newTable => setTable(newTable)} ${props} width="${CONTROL_WIDTH}"/>
                    };
                `;
            }}
        >
            {values => {
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a table...';

                return (
                    <Select
                        options={[
                            {
                                value: null,
                                label: placeholder,
                                disabled: !values.shouldAllowPickingNone,
                            },
                            ...tableOptions,
                        ]}
                        value={value}
                        onChange={newValue => setValue(newValue as string)}
                        {...values}
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

export const _TablePickerExample = {
    render: () => <TablePickerExample />,
};

function TablePickerSyncedExample() {
    const [value, setValue] = useState<null | string>(null);
    return (
        <Example
            {...sharedModelPickerExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React from 'react';
                    import {TablePickerSynced} from '@airtable/blocks/ui';

                    const TablePickerSyncedExample = () => (
                        <TablePickerSynced globalConfigKey="tableId" ${props} width="${CONTROL_WIDTH}"/>
                    );
                `;
            }}
        >
            {values => {
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a table...';

                return (
                    <Select
                        options={[
                            {
                                value: null,
                                label: placeholder,
                                disabled: !values.shouldAllowPickingNone,
                            },
                            ...tableOptions,
                        ]}
                        value={value}
                        onChange={newValue => setValue(newValue as string)}
                        {...values}
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

export const _TablePickerSyncedExample = {
    render: () => <TablePickerSyncedExample />,
};
