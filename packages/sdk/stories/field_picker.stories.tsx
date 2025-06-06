import React, {useState} from 'react';
import Select, {selectStylePropTypes} from '../src/ui/select';
import {keys} from '../src/private_utils';
import theme from '../src/ui/theme/default_theme';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';
import {FieldPicker} from '../src/ui/ui';

export default {
    component: FieldPicker,
};

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

function FieldPickerExample() {
    const [value, setValue] = useState<null | string>(null);
    return (
        <Example
            {...sharedModelPickerExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React, {useState} from 'react';
                    import {FieldPicker, useBase} from '@airtable/blocks/ui';

                    const FieldPickerExample = () => {
                        const [field, setField] = useState(null);
                        const base = useBase();
                        const table = base.getTableByNameIfExists("Tasks");
                        // If table is null or undefined, the FieldPicker will not render.

                        return <FieldPicker table={table} field={field} onChange={newField => setField(newField)} ${props} width="${CONTROL_WIDTH}"/>
                    };
                `;
            }}
        >
            {values => {
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a field...';

                return (
                    <Select
                        options={[
                            {
                                value: null,
                                label: placeholder,
                                disabled: !values.shouldAllowPickingNone,
                            },
                            ...fieldOptions,
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

export const _FieldPickerExample = {
    render: () => <FieldPickerExample />,
};

function FieldPickerSyncedExample() {
    const [value, setValue] = useState<null | string>(null);
    return (
        <Example
            {...sharedModelPickerExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React from 'react';
                    import {FieldPickerSynced, useBase} from '@airtable/blocks/ui';

                    const FieldPickerSyncedExample = () => {
                        const base = useBase();
                        const table = table.getTableByNameIfExists("Tasks");
                        // If table is null or undefined, the FieldPickerSynced will not render.

                        return <FieldPickerSynced table={table} globalConfigKey="fieldId" ${props} width="${CONTROL_WIDTH}"/>
                    };
                `;
            }}
        >
            {values => {
                const placeholder = values.shouldAllowPickingNone ? 'None' : 'Pick a field...';

                return (
                    <Select
                        options={[
                            {
                                value: null,
                                label: placeholder,
                                disabled: !values.shouldAllowPickingNone,
                            },
                            ...fieldOptions,
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

export const _FieldPickerSyncedExample = {
    render: () => <FieldPickerSyncedExample />,
};
