// @flow
import React, {useState} from 'react';
import {Switch} from '@airtable/blocks/ui';

export default function SwitchExample(props: void) {
    const [isEnabled, setIsEnabled] = useState(false);
    return (
        <Switch
            value={isEnabled}
            width="200px"
            onChange={(newValue: boolean) => setIsEnabled(newValue)}
            label="Switch on/off"
        />
    );
}
