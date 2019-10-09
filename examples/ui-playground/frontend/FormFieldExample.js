// @flow
import React, {useState} from 'react';
import {
    Box,
    colors,
    ColorPalette,
    FormField,
    FieldPicker,
    Input,
    SelectButtons,
    TablePicker,
    Toggle,
    ViewPicker,
    useBase,
} from '@airtable/blocks/ui';

export default function FieldPickerExample(props: void) {
    const base = useBase();
    const [name, setName] = useState('');
    const [table, setTable] = useState(base.tables[0]);
    const [view, setView] = useState(null);
    const [field, setField] = useState(null);
    const [coolLevel, setCoolLevel] = useState('Kinda cool');
    const [color, setColor] = useState();
    const [toggleValue, setToggleValue] = useState(false);

    const coolOptions = [
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
    const allowedColors = ((Object.values(colors).slice(0, 10): any): Array<string>);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignSelf="flex-start"
            width="400px"
            marginTop={3}
        >
            <FormField label="Name">
                <Input
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </FormField>
            <FormField label="Table">
                <TablePicker table={table} onChange={setTable} />
            </FormField>
            <FormField label="View">
                <ViewPicker table={table} view={view} onChange={setView} />
            </FormField>
            <FormField label="Field">
                <FieldPicker table={table} field={field} onChange={setField} />
            </FormField>
            <FormField label="How cool?">
                <SelectButtons value={coolLevel} options={coolOptions} onChange={setCoolLevel} />
            </FormField>
            <FormField label="Color">
                <ColorPalette allowedColors={allowedColors} color={color} onChange={setColor} />
            </FormField>
        </Box>
    );
}
