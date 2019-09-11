// @flow
import React, {useState} from 'react';
import {Select} from '@airtable/blocks/ui';

export default function SelectExample(props: void) {
    const [selectValue, setSelectValue] = useState('foo');
    return (
        <Select
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
