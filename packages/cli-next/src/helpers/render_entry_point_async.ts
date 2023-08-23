import {
    GLOBAL_BLOCK_CODE_VERSION_VARIABLE_NAME,
    GLOBAL_REACT_DOM_SERVER_VARIABLE_NAME,
    GLOBAL_REACT_DOM_VARIABLE_NAME,
    GLOBAL_REACT_VARIABLE_NAME,
    GLOBAL_RUN_BLOCK_FUNCTION_NAME,
} from '../settings';
import {System} from './system';

interface EntryPointOptions {
    mode: 'development' | 'production';
    destination: string;
    userEntryPoint: string;
    gitHash?: string;
    blockBaseUrl?: string;
}

export async function renderEntryPointAsync(
    sys: System,
    {mode, destination, userEntryPoint, gitHash, blockBaseUrl}: EntryPointOptions,
): Promise<string> {
    const isDevelopment = mode === 'development';
    const ifDevelopmentMode = (tmpl: () => string) => (isDevelopment ? tmpl() : '');
    const frontendEntryModulePath = `./${sys.path.relative(
        sys.path.dirname(destination),
        userEntryPoint,
    )}`;

    const addVersionToWindow = gitHash
        ? `window['${GLOBAL_BLOCK_CODE_VERSION_VARIABLE_NAME}'] = '${gitHash}';`
        : '';

    return `
var ReactDOM = require('react-dom');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

window['${GLOBAL_REACT_VARIABLE_NAME}'] = React;
window['${GLOBAL_REACT_DOM_VARIABLE_NAME}'] = ReactDOM;
window['${GLOBAL_REACT_DOM_SERVER_VARIABLE_NAME}'] = ReactDOMServer;
${addVersionToWindow}
var didRun = false;
window['${GLOBAL_RUN_BLOCK_FUNCTION_NAME}'] = function runBlock() {
    if (didRun) {
        console.log('Refusing to re-run block');
        return;
    }
    didRun = true;
    ${ifDevelopmentMode(
        () =>
            // In development mode, make sure requests to relative paths get
            // routed to the local backend (instead of the block router).
            `
    var blockUrl = ${JSON.stringify(blockBaseUrl)};

    var baseTag = document.createElement('base');
    baseTag.setAttribute('href', blockUrl);
    document.head.appendChild(baseTag);
`,
    )}
    // Requiring the entry point file runs user code. Be sure to do any setup
    // above this line.
    require(${JSON.stringify(frontendEntryModulePath)});
};
`;
}
