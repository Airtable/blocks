// @flow
import React, {useState} from 'react';
import {ChoiceToken, useBase, Box, FieldPicker} from '@airtable/blocks/ui';
import {fieldTypes} from '@airtable/blocks/models';

export default function ChoiceTokenExample(props: void) {
    const [field, setField] = useState(null);
    const base = useBase();
    const table = base.tables[0];

    return (
        <Box display="flex" alignSelf="stretch" alignItems="center" flexDirection="column">
            <FieldPicker
                table={table}
                field={field}
                onChange={val => setField((val: any))}
                allowedTypes={[fieldTypes.SINGLE_SELECT, fieldTypes.MULTIPLE_SELECTS]}
                marginTop="100px"
                width="200px"
            />
            <Box width="200px" marginTop={2}>
                {field &&
                    field.options &&
                    Array.isArray(field.options.choices) &&
                    field.options.choices.map((choice, index) => (
                        <ChoiceToken key={index} choice={choice} margin={1} />
                    ))}
            </Box>
        </Box>
    );
}
