// @flow
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {values} from '../src/private_utils';
import colors from '../src/colors';
import ColorPalette from '../src/ui/color_palette';
import FormField from '../src/ui/form_field';
import Box from '../src/ui/box';
import Input from '../src/ui/input';
import Select from '../src/ui/select';
import SelectButtons from '../src/ui/select_buttons';

const stories = storiesOf('FormField', module);

stories.add('text input field', () =>
    React.createElement(() => {
        const [value, setValue] = useState('');
        return (
            <FormField label="Text Input field">
                <Input value={value} onChange={e => setValue(e.target.value)} />
            </FormField>
        );
    }),
);

stories.add('select field', () =>
    React.createElement(() => {
        const [value, setValue] = useState('Option 1');
        const options = [
            {value: 'Option 1', label: 'Option 1'},
            {value: 'Option 2', label: 'Option 2'},
            {value: 'Option 3', label: 'Option 3'},
        ];
        return (
            <FormField label="Select field">
                <Select value={value} options={options} onChange={val => setValue(val as string)} />
            </FormField>
        );
    }),
);

stories.add('with description', () =>
    React.createElement(() => {
        const [value, setValue] = useState('');
        return (
            <FormField
                className="custom-class-name"
                label="Subject"
                description={
                    <React.Fragment>
                        Insert values by wrapping the field name in brackets:{' '}
                        <span style={{fontWeight: 500}}>
                            {'{'}Name{'}'}
                        </span>
                    </React.Fragment>
                }
            >
                <Input value={value} onChange={e => setValue(e.target.value)} />
            </FormField>
        );
    }),
);

stories.add('custom className', () =>
    React.createElement(() => {
        const [value, setValue] = useState('');
        return (
            <FormField className="custom-class-name" label="Inspect to see custom class name">
                <Input value={value} onChange={e => setValue(e.target.value)} />
            </FormField>
        );
    }),
);

stories.add('custom id', () =>
    React.createElement(() => {
        const [value, setValue] = useState('');
        return (
            <FormField id="custom-id" label="Inspect to see custom ID">
                <Input value={value} onChange={e => setValue(e.target.value)} />
            </FormField>
        );
    }),
);

stories.add('forwarded ref', () =>
    React.createElement(() => {
        return (
            <FormField
                id="custom-id"
                ref={node => {
                    // eslint-disable-next-line no-console
                    console.log(node);
                }}
                label="Look in console to see ref"
            />
        );
    }),
);

stories.add('multiple formfields', () =>
    React.createElement(() => {
        const [textValue, setTextValue] = useState('');
        const [selectValue, setSelectValue] = useState('Option 1');
        const [color, setColor] = useState(null);
        const [coolLevel, setCoolLevel] = useState('Kinda cool');

        const selectOptions = [
            {value: 'Option 1', label: 'Option 1'},
            {value: 'Option 2', label: 'Option 2'},
            {value: 'Option 3', label: 'Option 3'},
        ];
        // eslint-disable-next-line flowtype/no-weak-types
        const allowedColors = values(colors).slice(0, 12);
        const selectButtonsOptions = [
            {
                value: 'Kinda cool',
                label: 'Kinda cool',
            },
            {
                value: 'Pretty cool',
                label: 'Pretty cool',
            },
            {
                value: 'So cool',
                label: 'So cool',
            },
        ];
        return (
            <div style={{width: 400, margin: 'auto'}}>
                <FormField
                    label="Text input"
                    description="Insert values by wrapping the field name in brackets"
                >
                    <Input value={textValue} onChange={e => setTextValue(e.target.value)} />
                </FormField>
                <FormField label="Select">
                    <Select
                        value={selectValue}
                        options={selectOptions}
                        onChange={val => setSelectValue(val as string)}
                    />
                </FormField>
                <FormField label="Color palette" description="Pick a color from the color palette">
                    <ColorPalette
                        color={color}
                        allowedColors={allowedColors}
                        onChange={setColor as any}
                    />
                </FormField>
                <FormField label="Select buttons">
                    <SelectButtons
                        value={coolLevel}
                        options={selectButtonsOptions}
                        onChange={val => setCoolLevel(val as string)}
                    />
                </FormField>
            </div>
        );
    }),
);

stories.add('width 100% inside container', () =>
    React.createElement(() => {
        const [value, setValue] = useState('');
        return (
            <Box border="thick" width="500px" display="flex">
                <FormField label="Sample formfield" description="Width should fill container">
                    <Input value={value} onChange={e => setValue(e.target.value)} />
                </FormField>
            </Box>
        );
    }),
);
