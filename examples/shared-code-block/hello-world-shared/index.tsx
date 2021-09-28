import React, {useState} from 'react';
import {useBase} from '@airtable/blocks/ui';

export function Hello() {
    const [count, setCount] = useState(0);
    const base = useBase();

    return (
        <div>
            <p>
                You clicked {count} times in base "{base.name}"
            </p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}
