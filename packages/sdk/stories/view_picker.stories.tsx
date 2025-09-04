import React, {useState} from 'react';
import Select from '../src/base/ui/select';
import {keys} from '../src/shared/private_utils';
import theme from '../src/base/ui/theme/default_theme';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';
import {ViewPicker} from '../src/base/ui/ui';

export default {
    component: ViewPicker,
};

const viewOptions = ['All tasks', 'Grouped by status', 'Incomplete tasks'].map(value => ({
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
    styleProps: [] as string[],
} as const;

function ViewPickerExample() {
    const [value, setValue] = useState<null | string>(null);
    return (
        <Example
            {...sharedModelPickerExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React, {useState} from 'react';
                    import {ViewPicker, useBase} from '@airtable/blocks/base/ui';

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
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a view...';

                return (
                    <Select
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
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

export const _ViewPickerExample = {
    render: () => <ViewPickerExample />,
};

function ViewPickerSyncedExample() {
    const [value, setValue] = useState<null | string>(null);
    return (
        <Example
            {...sharedModelPickerExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React from 'react';
                    import {useBase, ViewPickerSynced} from '@airtable/blocks/base/ui';

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
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a view...';

                return (
                    <Select
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
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

export const _ViewPickerSyncedExample = {
    render: () => <ViewPickerSyncedExample />,
};
