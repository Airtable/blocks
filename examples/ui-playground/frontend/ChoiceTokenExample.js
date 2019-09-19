// @flow
import React, {useState} from 'react';
import {ChoiceToken, useBase, Box, FieldPicker} from '@airtable/blocks/ui';
import {fieldTypes} from '@airtable/blocks/models';

export default function ChoiceTokenExample(props: void) {
    const [field, setField] = useState(null);
    const base = useBase();
    const table = base.tables[0];

    return (
        <Box display="flex" alignSelf="stretch" flexDirection="column">
            <FieldPicker
                style={{marginTop: 100, width: 200}}
                table={table}
                field={field}
                onChange={setField}
                allowedTypes={[fieldTypes.SINGLE_SELECT, fieldTypes.MULTIPLE_SELECTS]}
            />
            <Box display="flex">
                {field &&
                    field.options &&
                    Array.isArray(field.options.choices) &&
                    field.options.choices.map((choice, index) => (
                        <ChoiceToken key={index} choice={(choice: Object)} margin={3} />
                    ))}
            </Box>
        </Box>
    );
}
