// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import BlockWrapper from './block_wrapper';

let hasBeenInitialized = false;
function initializeBlock(getEntryElement: () => React.Node) {
    const body = typeof document !== 'undefined' ? document.body : null;
    if (!body) {
        throw new Error('initializeBlock should only be called from browser environments');
    }

    if (hasBeenInitialized) {
        throw new Error('initializeBlock should only be called once');
    }
    hasBeenInitialized = true;

    if (typeof getEntryElement !== 'function') {
        throw new Error(
            'The first argument to initializeBlock should be a function returning a React element',
        );
    }

    const entryElement = getEntryElement();
    if (!React.isValidElement(entryElement)) {
        throw new Error(
            "The first argument to initializeBlock didn't return a valid React element",
        );
    }

    const container = document.createElement('div');
    body.appendChild(container);
    ReactDOM.render(<BlockWrapper>{entryElement}</BlockWrapper>, container);
}

export default initializeBlock;
