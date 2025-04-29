/** @module @airtable/blocks/ui: initializeBlock */ /** */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {spawnError} from '../../shared/error_utils';
import {InterfaceBlockSdk} from '../sdk';
import getAirtableInterface from '../../injected/airtable_interface';
import {BlockRunContextType} from '../types/airtable_interface';
import {BlockWrapper} from './block_wrapper';

let hasBeenInitialized = false;

/** */
type EntryElementFunction = () => React.ReactNode;
/** @hidden */
interface EntryPoints {
    interface?: EntryElementFunction;
}

/**
 * `initializeBlock` takes the top-level React component in your tree and renders it. It is conceptually similar to `ReactDOM.render`, but takes care of some Extensions-specific things.
 *
 * @param entryPoints An object with an `interface` property which is a function that returns your React Node.
 *
 * @example
 * ```js
 * import {initializeBlock} from '@airtable/blocks/interface/ui';
 * import React from 'react';
 *
 * function App() {
 *     return (
 *         <div>Hello world 🚀</div>
 *     );
 * }
 *
 * initializeBlock({interface: () => <App />});
 * ```
 * @docsPath UI/utils/initializeBlock
 * @internal
 */
export function initializeBlock(entryPoints: EntryPoints) {
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
    const runContext = airtableInterface.sdkInitData.runContext;
    switch (runContext.type) {
        case BlockRunContextType.PAGE_ELEMENT_IN_QUERY_CONTAINER: {
            if (entryPoints.interface === undefined) {
                throw spawnError(
                    'If running an extension within the interface, it must have a interface initialization function',
                );
            }
            if (typeof entryPoints.interface !== 'function') {
                throw spawnError(
                    'initializeBlock must contain a interface function that returns a React element',
                );
            }
            entryElement = entryPoints.interface();
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

    const container = document.createElement('div');
    body.appendChild(container);
    ReactDOM.render(<BlockWrapper sdk={sdk}>{entryElement}</BlockWrapper>, container);
}

let sdk: InterfaceBlockSdk;

export function __injectSdkIntoInitializeBlock(_sdk: InterfaceBlockSdk) {
    sdk = _sdk;
}

export function __resetHasBeenInitialized() {
    hasBeenInitialized = false;
}
