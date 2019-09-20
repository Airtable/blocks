// @flow
import React, {useState} from 'react';
import {Toggle} from '@airtable/blocks/ui';

export default function ToggleExample(props: void) {
    const [isEnabled, setIsEnabled] = useState(false);
    return (
        <Toggle
            value={isEnabled}
            onChange={(newValue: boolean) => setIsEnabled(newValue)}
            label="Toggle on/off"
            theme={Toggle.themes.RED}
            padding={3}
        />
    );
}
