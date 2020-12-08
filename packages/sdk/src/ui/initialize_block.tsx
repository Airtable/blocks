/** @module @airtable/blocks/ui: initializeBlock */ /** */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {spawnError} from '../error_utils';
import Sdk from '../sdk';
import BlockWrapper from './block_wrapper';

let hasBeenInitialized = false;

/**
 * `initializeBlock` takes the top-level React component in your tree and renders it. It is conceptually similar to `ReactDOM.render`, but takes care of some Apps-specific things.
 *
 * @param getEntryElement A function that returns your React Node.
 *
 * @example
 * ```js
 * import {initializeBlock} from '@airtable/blocks/ui';
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
function initializeBlock(getEntryElement: () => React.ReactNode) {
    const body = typeof document !== 'undefined' ? document.body : null;
    if (!body) {
        throw spawnError('initializeBlock should only be called from browser environments');
    }
    if (hasBeenInitialized) {
        throw spawnError('initializeBlock should only be called once');
    }
    hasBeenInitialized = true;

    if (typeof getEntryElement !== 'function') {
        throw spawnError(
            'The first argument to initializeBlock should be a function returning a React element',
        );
    }
    const entryElement = getEntryElement();
    if (!React.isValidElement(entryElement)) {
        throw spawnError(
            "The first argument to initializeBlock didn't return a valid React element",
        );
    }
    sdk.__setBatchedUpdatesFn(ReactDOM.unstable_batchedUpdates);

    const container = document.createElement('div');
    body.appendChild(container);
    ReactDOM.render(<BlockWrapper sdk={sdk}>{entryElement}</BlockWrapper>, container);
}

let sdk: Sdk;

export function __injectSdkIntoInitializeBlock(_sdk: Sdk) {
    sdk = _sdk;
}

export default initializeBlock;
