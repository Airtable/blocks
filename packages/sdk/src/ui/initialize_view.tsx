/** @module @airtable/blocks/ui: initializeView */ /** */
import * as React from 'react';
import ReactDOM from 'react-dom';
import Sdk from '../sdk';
import {spawnError} from '../error_utils';
import getAirtableInterface from '../injected/airtable_interface';
import {BlockRunContextType} from '../types/airtable_interface';
import Table from '../models/table';
import View from '../models/view';
import BlockWrapper from './block_wrapper';

let hasBeenInitialized = false;

/**
 * `unstable_initializeView` takes the top-level React component in your tree and renders it as an Airtable view. It is conceptually similar to `ReactDOM.render`, but also passes the table and view that this view is in.
 *
 * @param getEntryElement A function that returns your React Node.
 *
 * @example
 * ```js
 * import {unstable_initializeView} from '@airtable/blocks/ui';
 * import React from 'react';
 *
 * function MyCustomView({table, view}) {
 *     return (
 *         <div>Hello world 🚀. I'm a view with the name {view.name}!</div>
 *     );
 * }
 *
 * unstable_initializeView(({table, view}) => <MyCustomView table={table} view={view}/>);
 * ```
 * @docsPath UI/utils/initializeView
 * @hidden
 */
function unstable_initializeView(
    getEntryElement: ({table, view}: {table: Table; view: View}) => React.ReactNode,
) {
    const body = typeof document !== 'undefined' ? document.body : null;
    if (!body) {
        throw spawnError('initializeView should only be called from browser environments');
    }
    if (hasBeenInitialized) {
        throw spawnError('initializeView should only be called once');
    }
    hasBeenInitialized = true;

    if (typeof getEntryElement !== 'function') {
        throw spawnError(
            'The first argument to initializeView should be a function returning a React element',
        );
    }

    const airtableInterface = getAirtableInterface();
    const runContext = airtableInterface.sdkInitData.runContext;
    if (runContext.type !== BlockRunContextType.VIEW) {
        // If this is called within a Block Page, or other context we will silently return, _not_
        // throw, because it's legal to have both initializeBlock and initializeView in a single block
        // and only the correct context will actually render onto the DOM.
        return;
    }
    const table = sdk.base.getTableById(runContext.tableId);
    const view = table.getViewById(runContext.viewId);

    const entryElement = getEntryElement({table, view});
    if (!React.isValidElement(entryElement)) {
        throw spawnError(
            "The first argument to initializeView didn't return a valid React element",
        );
    }

    sdk.__setBatchedUpdatesFn(ReactDOM.unstable_batchedUpdates);

    const container = document.createElement('div');
    body.appendChild(container);
    ReactDOM.render(<BlockWrapper sdk={sdk}>{entryElement}</BlockWrapper>, container);
}

let sdk: Sdk;

// The application-level Sdk instance must be injected dynamically to avoid
// circular dependencies at the time of module resolution.
export function __injectSdkIntoInitializeView(_sdk: Sdk) {
    sdk = _sdk;
}

export default unstable_initializeView;
