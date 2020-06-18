import React, {Fragment, useEffect, useState} from 'react';
import {initializeBlock, useSettingsButton, useViewport} from '@airtable/blocks/ui';
import ChartContainer from './ChartContainer';
import FormContainer from './FormContainer';
import useSettings from './settings';

import {
    MINIMUM_VIEWPORT_WIDTH_FOR_CHART,
    MINIMUM_VIEWPORT_WIDTH_FOR_SETTINGS,
    SETTINGS_FORM_BOX_WIDTH,
} from './constants';

function VegaLiteBlock() {
    const validatedSettings = useSettings();
    const {isValid} = validatedSettings;
    const [errors, setErrors] = useState([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const viewport = useViewport();
    const {width, height} = viewport.size;

    useSettingsButton(() => {
        const newIsSettingsOpen = !isSettingsOpen;

        // This block has a substantial settings form. If the user triggers
        // settings for opening, then the block must insist on opening in
        // fullscreen view.
        if (
            newIsSettingsOpen &&
            width < MINIMUM_VIEWPORT_WIDTH_FOR_SETTINGS &&
            !viewport.isFullscreen
        ) {
            viewport.enterFullscreenIfPossible();
        }
        setIsSettingsOpen(newIsSettingsOpen);
    });

    useEffect(() => {
        // If the settings are invalid and there is enough room to do so,
        // force the settings form open, otherwise, allow it to remain in
        // its current state. This also means that if there is enough
        // space for the settings form, and the settings are invalid, it will
        // be impossible to close the settings form. This is intentional.
        let flag = isSettingsOpen;

        if (!isValid && width > MINIMUM_VIEWPORT_WIDTH_FOR_SETTINGS) {
            flag = true;
        }

        if (isSettingsOpen !== flag) {
            setIsSettingsOpen(flag);
        }

        // Monitor viewport.isFullscreen to force the settings form open if the
        // settings are invalid, but the user closed the settings form.
    }, [isSettingsOpen, viewport.isFullscreen, isValid, width]);

    let chartContainerWidth = isSettingsOpen ? Math.max(0, width - SETTINGS_FORM_BOX_WIDTH) : width;
    const formContainerWidth = SETTINGS_FORM_BOX_WIDTH;

    // While in fullscreen mode, if the user has the settings form open and
    // the available width for the FormContainer becomes less than what we know is
    // needed for the layout, then assume the user wants to work in the editor
    // and leave it open, but close the ChartContainer.
    if (isSettingsOpen && viewport.isFullscreen && width < MINIMUM_VIEWPORT_WIDTH_FOR_CHART) {
        chartContainerWidth = 0;
    }

    const chartContainerProps = {
        errors,
        height,
        width: chartContainerWidth,
        validatedSettings,
        setErrors,
    };
    const formContainerProps = {
        errors,
        height,
        isSettingsOpen,
        width: formContainerWidth,
        validatedSettings,
        setErrors,
    };

    return (
        <Fragment>
            {formContainerWidth ? <FormContainer {...formContainerProps} /> : null}
            {chartContainerWidth ? <ChartContainer {...chartContainerProps} /> : null}
        </Fragment>
    );
}

initializeBlock(() => <VegaLiteBlock />);
