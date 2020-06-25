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
    const [isSettingsOpenPendingFullscreen, setIsSettingsOpenPendingFullscreen] = useState(false);
    const viewport = useViewport();
    const {width, height} = viewport.size;

    useSettingsButton(() => {
        const newIsSettingsOpen = !isSettingsOpen;

        // This block has a substantial settings form. If the user triggers
        // settings for opening, then the block must insist on opening in
        // fullscreen view if there is not enough horizontal space.
        if (
            newIsSettingsOpen &&
            width < MINIMUM_VIEWPORT_WIDTH_FOR_SETTINGS &&
            !viewport.isFullscreen
        ) {
            setIsSettingsOpenPendingFullscreen(true);
            viewport.enterFullscreenIfPossible();
        } else {
            setIsSettingsOpen(newIsSettingsOpen);
        }
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

        // If we've left fullscreen view, and there is not enough room
        // for the settings form to be displayed, then we must close it.
        // This should occur even if the settings are in an invalid state,
        // because the user will see a suitable error message centered
        // on the screen (instead of a settings form awkwardly jammed in)
        if (!viewport.isFullscreen && width < MINIMUM_VIEWPORT_WIDTH_FOR_SETTINGS) {
            flag = false;
        }

        // If we were forced to call viewport.enterFullscreenIfPossible()
        // inside the useSettingsButton handler, we'll have a "pending" bit
        // that we need to resolve.
        if (viewport.isFullscreen && isSettingsOpenPendingFullscreen) {
            setIsSettingsOpenPendingFullscreen(false);
            flag = true;
        }

        if (isSettingsOpen !== flag) {
            setIsSettingsOpen(flag);
        }

        // isSettingsOpen:
        //  to determine whether or not there is actually anything to do after
        //  evaluating each condition.
        //
        // viewport.isFullscreen:
        //  to force the settings form open if the settings are invalid, but
        //  the user closed the settings form.
        //
        // isSettingsOpenPendingFullscreen:
        //  to signal that the user entered fullscreen as a result of click the
        //  settings cog.
        //
        // isValid:
        //  to determine whether or not the the settings should be _forced_ open
        //  to address any invalid settings (eg. missing table or view)
        //
        // width:
        //  to determine whether or not there is enough space for the settings
        //  form to be open.
    }, [isSettingsOpen, viewport.isFullscreen, isSettingsOpenPendingFullscreen, isValid, width]);

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
