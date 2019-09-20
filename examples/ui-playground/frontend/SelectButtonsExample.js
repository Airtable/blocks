// @flow
import React, {useState} from 'react';
import {SelectButtons} from '@airtable/blocks/ui';

export default function SelectButtonsExample(props: void) {
    const [selectValue, setSelectValue] = useState('foo');
    return (
        <SelectButtons
            value={selectValue}
            onChange={setSelectValue}
            options={[
                {value: 'foo', label: 'foo'},
                {value: 'bar', label: 'bar'},
                {value: 'baz', label: 'baz'},
            ]}
            margin={3}
            maxWidth="400px"
        />
    );
}
