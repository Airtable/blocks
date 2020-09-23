import React, {useEffect, useRef, useState} from 'react';
import {saveSvgAsPng, svgAsDataUri} from 'save-svg-as-png';
import {
    Box,
    expandRecord,
    initializeBlock,
    Loader,
    useLoadable,
    useSettingsButton,
    useViewport,
    useWatchable,
} from '@airtable/blocks/ui';

import {createLayout} from './layout';
import loadCSS from './loadCSS';
import {useSettings} from './settings';
import SettingsForm from './SettingsForm';

// viz.js has a stack overflow when there are too many records. So add a limit to be safe.
const MAX_RECORDS = 100;
export const ExportType = Object.freeze({
    PNG: 'png',
    SVG: 'svg',
});

loadCSS();

const domParser = new DOMParser();

function FlowchartApp() {
    const viewport = useViewport();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    useSettingsButton(() => {
        if (!isSettingsVisible) {
            viewport.enterFullscreenIfPossible();
        }
        setIsSettingsVisible(!isSettingsVisible);
    });
    const settingsValidationResult = useSettings();
    const {queryResult} = settingsValidationResult.settings;
    useLoadable(queryResult);
    useWatchable(queryResult, ['records', 'cellValues', 'recordColors']);

    useEffect(() => {
        if (!settingsValidationResult.isValid) {
            setIsSettingsVisible(true);
        }
    }, [settingsValidationResult.isValid]);

    const graph = useRef(null);

    function draw() {
        if (!graph.current) {
            // Return early if ref isn't ready yet.
            return;
        }
        if (!settingsValidationResult.isValid) {
            graph.current.innerHTML = `<span class="prompt">${settingsValidationResult.message}</span>`;
            return;
        }

        if (!queryResult.isDataLoaded) {
            graph.current.innerHTML = '<span class="prompt">Loading...</span>';
        } else if (queryResult.records.length === 0) {
            graph.current.innerHTML = '<span class="prompt">Add some records to get started</span>';
        } else if (queryResult.records.length > MAX_RECORDS) {
            graph.current.innerHTML = `<span class="prompt">
                    The flowchart app can only visualize up to ${MAX_RECORDS} records. Try deleting some records or 
                    filtering them out of the view.
                </span>`;
        } else {
            createLayout(settingsValidationResult.settings).then(svg => {
                const svgDocument = domParser.parseFromString(svg, 'image/svg+xml');
                const svgElement = svgDocument.firstElementChild;
                if (svgElement && graph.current) {
                    // Set the width and height of the SVG element so that it takes up the full dimensions of the
                    // app frame.
                    const width = svgElement.getAttribute('width');
                    const height = svgElement.getAttribute('height');
                    if (Number(width) > Number(height)) {
                        svgElement.setAttribute('width', '100%');
                        svgElement.removeAttribute('height');
                    } else {
                        svgElement.setAttribute('height', '100%');
                        svgElement.removeAttribute('width');
                    }
                    graph.current.innerHTML = '';
                    graph.current.appendChild(svgElement);
                }
            });
        }
    }

    function _onGraphClick(e) {
        if (!queryResult || !queryResult.isDataLoaded) {
            return;
        }
        let target = e.target || null;
        // Traverse up the element tree from the click event target until we find an svg element
        // describing a 'node' that has a corresponding record that we can expand.
        while (target && target !== graph.current) {
            if (target.classList.contains('node')) {
                const record = queryResult.getRecordByIdIfExists(target.id);
                if (record) {
                    expandRecord(record);
                    return;
                }
            }
            target = target.parentElement;
        }
    }

    function _onExportGraph(exportType) {
        const {view} = settingsValidationResult.settings;
        if (view && graph.current) {
            const svgElement = graph.current.firstElementChild;
            if (svgElement) {
                if (exportType === ExportType.PNG) {
                    saveSvgAsPng(svgElement, `${view.name}.png`, {
                        scale: 2.0,
                    });
                } else if (exportType === ExportType.SVG) {
                    // Convert the SVG to a data URI and download it via an anchor link.
                    svgAsDataUri(svgElement, {}, uri => {
                        const downloadLink = document.createElement('a');
                        downloadLink.download = `${view.name}.svg`;
                        downloadLink.href = uri;
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    });
                } else {
                    throw new Error('Unexpected export type: ', exportType);
                }
            }
        }
    }

    draw();
    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            backgroundColor="#f5f5f5"
            overflow="hidden"
        >
            <div
                ref={graph}
                id="graph"
                style={{
                    flex: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 0,
                    height: '100%',
                }}
                onClick={_onGraphClick}
            >
                <Loader />
            </div>
            {isSettingsVisible && (
                <SettingsForm
                    setIsSettingsVisible={setIsSettingsVisible}
                    onExportGraph={_onExportGraph}
                    settingsValidationResult={settingsValidationResult}
                />
            )}
        </Box>
    );
}

initializeBlock(() => <FlowchartApp />);
