// @flow
import React, {useState} from 'react';
import {Input} from '@airtable/blocks/ui';

export default function InputExample(props: void) {
    const [selectValue, setInputValue] = useState('foo');
    return (
        <Input
            value={selectValue}
            onChange={e => setInputValue(e.target.value)}
            margin={3}
            maxWidth="400px"
        />
    );
}
