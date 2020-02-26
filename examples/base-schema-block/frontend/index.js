import React, {useState} from 'react';
import {initializeBlock, useSettingsButton} from '@airtable/blocks/ui';
import {viewport} from '@airtable/blocks';

import SchemaVisualizer from './SchemaVisualizer';
import FullscreenBox from './FullscreenBox';
import SettingsForm from './SettingsForm';
import './loadCss';

viewport.addMinSize({
    height: 320,
    width: 520,
});

function SchemaMapBlock() {
    const [shouldShowSettings, setShouldShowSettings] = useState(false);

    useSettingsButton(() => {
        // Enter fullscreen when settings is opened (but not when closed).
        if (!shouldShowSettings) {
            viewport.enterFullscreenIfPossible();
        }
        setShouldShowSettings(!shouldShowSettings);
    });

    return (
        <FullscreenBox id="index">
            <SchemaVisualizer />
            {shouldShowSettings && <SettingsForm setShouldShowSettings={setShouldShowSettings} />}
        </FullscreenBox>
    );
}

initializeBlock(() => <SchemaMapBlock />);
