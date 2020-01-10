import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import Select, {selectStylePropTypes} from '../src/ui/select';
import useTheme from '../src/ui/theme/use_theme';
import {keys} from '../src/private_utils';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';

const stories = storiesOf('ModelPickers', module);

const viewOptions = ['All tasks', 'Grouped by status', 'Incomplete tasks'].map(value => ({
    value,
    label: value,
}));

function ViewPickerExample() {
    const {selectSizes} = useTheme();
    return (
        <Example
            options={{
                size: {
                    type: 'selectButtons',
                    label: 'Size',
                    options: keys(selectSizes),
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
            }}
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
            styleProps={Object.keys(selectStylePropTypes)}
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

stories.add('viewpicker example', () => <ViewPickerExample />);
