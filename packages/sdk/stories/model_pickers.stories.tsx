import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import Select, {selectStylePropTypes} from '../src/ui/select';
import useTheme from '../src/ui/theme/use_theme';
import {keys} from '../src/private_utils';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';
import theme from '../src/ui/theme/default_theme';

const stories = storiesOf('ModelPickers', module);

const viewOptions = ['All tasks', 'Grouped by status', 'Incomplete tasks'].map(value => ({
    value,
    label: value,
}));
const tableOptions = ['Tasks', 'Projects', 'Teams'].map(value => ({
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

function ViewPickerExample() {
    return (
        <Example
            {...sharedModelPickerExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React, {useState} from 'react';
                    import {ViewPicker, useBase} from '@airtable/blocks/ui';

                    const ViewPickerExample = () => {                    
                        const [view, setView] = useState(null);
                        const base = useBase();
                        const table = base.getTableByNameIfExists('Tasks');
                        // If table is null or undefined, the ViewPicker will not render.

                        return <ViewPicker table={table} view={view} onChange={newView => setView(newView)} ${props} width="${CONTROL_WIDTH}"/>
                    };
                `;
            }}
        >
            {values => {
                const [value, setValue] = useState<null | string>(null);
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a view...';

                return (
                    <Select
                        width={CONTROL_WIDTH}
                        options={[
                            {
                                value: null,
                                label: placeholder,
                                disabled: !values.shouldAllowPickingNone,
                            },
                            ...viewOptions,
                        ]}
                        value={value}
                        onChange={newValue => setValue(newValue as string)}
                        {...values}
                    />
                );
            }}
        </Example>
    );
}

stories.add('ViewPicker example', () => <ViewPickerExample />);

function ViewPickerSyncedExample() {
    return (
        <Example
            {...sharedModelPickerExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React from 'react';
                    import {useBase, ViewPickerSynced} from '@airtable/blocks/ui';

                    const ViewPickerSyncedExample = () => {                    
                        const base = useBase();
                        const table = base.getTableByNameIfExists('Tasks');
                        // If table is null or undefined, the ViewPickerSynced will not render.

                        return <ViewPickerSynced table={table} globalConfigKey='viewId' ${props} width="${CONTROL_WIDTH}"/>
                    };
                `;
            }}
        >
            {values => {
                const [value, setValue] = useState<null | string>(null);
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a view...';

                return (
                    <Select
                        width={CONTROL_WIDTH}
                        options={[
                            {
                                value: null,
                                label: placeholder,
                                disabled: !values.shouldAllowPickingNone,
                            },
                            ...viewOptions,
                        ]}
                        value={value}
                        onChange={newValue => setValue(newValue as string)}
                        {...values}
                    />
                );
            }}
        </Example>
    );
}

stories.add('ViewPickerSynced example', () => <ViewPickerSyncedExample />);

function TablePickerExample() {
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
                const [value, setValue] = useState<null | string>(null);
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a table...';

                return (
                    <Select
                        width={CONTROL_WIDTH}
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
                    />
                );
            }}
        </Example>
    );
}

stories.add('TablePicker example', () => <TablePickerExample />);

function TablePickerSyncedExample() {
    return (
        <Example
            {...sharedModelPickerExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import {TablePickerSynced} from '@airtable/blocks/ui';

                    const tablePickerSyncedExample = (
                        <TablePickerSynced globalConfigKey="tableId" ${props} width="${CONTROL_WIDTH}"/>
                    );
                `;
            }}
        >
            {values => {
                const [value, setValue] = useState<null | string>(null);
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a table...';

                return (
                    <Select
                        width={CONTROL_WIDTH}
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
                    />
                );
            }}
        </Example>
    );
}

stories.add('TablePickerSynced example', () => <TablePickerSyncedExample />);
