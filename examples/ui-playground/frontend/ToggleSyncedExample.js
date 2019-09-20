// @flow
import React, {useState} from 'react';
import {ToggleSynced, Toggle} from '@airtable/blocks/ui';

export default function ToggleSyncedExample(props: void) {
    return (
        <ToggleSynced
            globalConfigKey="isEnabled"
            label="Toggle on/off"
            theme={Toggle.themes.RED}
            padding={3}
        />
    );
}
