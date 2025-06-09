/** @module @airtable/blocks/ui: initializeBlock */ /** */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {spawnError} from '../../shared/error_utils';
import Sdk from '../sdk';
import getAirtableInterface from '../../injected/airtable_interface';
import {BlockRunContextType} from '../types/airtable_interface';
import Table from '../models/table';
import View from '../models/view';
import BlockWrapper from './block_wrapper';

let hasBeenInitialized = false;

/** */
type DashboardEntryElementFunction = () => React.ReactNode;
/** @hidden */
type ViewEntryElementFunction = ({table, view}: {table: Table; view: View}) => React.ReactNode;
/** @hidden */
interface EntryPoints {
    dashboard?: DashboardEntryElementFunction;
    view?: ViewEntryElementFunction;
}

/** @hidden */
type DashboardOrEntryPoints = DashboardEntryElementFunction | EntryPoints;

/**
 * `initializeBlock` takes the top-level React component in your tree and renders it. It is conceptually similar to `ReactDOM.render`, but takes care of some Extensions-specific things.
 *
 * @param getEntryElement A function that returns your React Node.
 *
 * @example
 * ```js
 * import {initializeBlock} from '@airtable/blocks/base/ui';
 * import React from 'react';
 *
 * function App() {
 *     return (
 *         <div>Hello world 🚀</div>
 *     );
 * }
 *
 * initializeBlock(() => <App />);
 * ```
 * @docsPath UI/utils/initializeBlock
 */
export function initializeBlock(getEntryElement: DashboardOrEntryPoints) {
    const entryPoints =
        typeof getEntryElement === 'function' ? {dashboard: getEntryElement} : getEntryElement;

    const body = typeof document !== 'undefined' ? document.body : null;
    if (!body) {
        throw spawnError('initializeBlock should only be called from browser environments');
    }
    if (hasBeenInitialized) {
        throw spawnError('initializeBlock should only be called once');
    }
    hasBeenInitialized = true;

    const airtableInterface = getAirtableInterface();

    let entryElement: React.ReactNode;
    const runContext = airtableInterface.sdkInitData.runContext ?? {
        type: BlockRunContextType.DASHBOARD_APP,
    };
    switch (runContext.type) {
        case BlockRunContextType.DASHBOARD_APP: {
            if (entryPoints.dashboard === undefined) {
                throw spawnError(
                    'If running an extension within the dashboard, it must have a dashboard initialization function',
                );
            }
            if (typeof entryPoints.dashboard !== 'function') {
                throw spawnError(
                    'initializeBlock must contain a dashboard function that returns a React element',
                );
            }
            entryElement = entryPoints.dashboard();
            break;
        }
        case BlockRunContextType.VIEW: {
            if (entryPoints.view === undefined) {
                throw spawnError(
                    'If running an extension within a view, it must have a view initialization function',
                );
            }
            if (typeof entryPoints.view !== 'function') {
                throw spawnError(
                    'initializeBlock must contain a view function that returns a React element',
                );
            }

            const table = sdk.base.getTableById(runContext.tableId);
            const view = table.getViewById(runContext.viewId);
            entryElement = entryPoints.view({table, view});
            break;
        }
        default:
            throw spawnError('Invalid context to run ');
    }

    if (!React.isValidElement(entryElement)) {
        throw spawnError(
            "The first argument to initializeBlock didn't return a valid React element",
        );
    }

    if (ReactDOM.unstable_batchedUpdates) {
        sdk.__setBatchedUpdatesFn(ReactDOM.unstable_batchedUpdates);
    }

    const container = document.createElement('div');
    container.style.height = '100%';
    container.style.width = '100%';
    body.appendChild(container);

    try {
        const {createRoot} = require('react-dom/client');
        createRoot(container).render(<BlockWrapper sdk={sdk}>{entryElement}</BlockWrapper>);
    } catch (e) {
        ReactDOM.render(<BlockWrapper sdk={sdk}>{entryElement}</BlockWrapper>, container);
    }
}

let sdk: Sdk;

export function __injectSdkIntoInitializeBlock(_sdk: Sdk) {
    sdk = _sdk;
}

export function __resetHasBeenInitialized() {
    hasBeenInitialized = false;
}
