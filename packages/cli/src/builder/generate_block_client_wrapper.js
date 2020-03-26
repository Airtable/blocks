// @flow
const blockCliConfigSettings = require('../config/block_cli_config_settings');

module.exports = function generateBlockClientWrapperCode(
    frontendEntryModulePath: string,
    isDevelopment: boolean,
): string {
    // NOTE: this must return ES5 (so no JSX!) since it won't get transpiled on the client.
    // This puts React on window so the block SDK can access it.
    return `
var ReactDOM = require('react-dom');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

window['${blockCliConfigSettings.GLOBAL_REACT_VARIABLE_NAME}'] = React;
window['${blockCliConfigSettings.GLOBAL_REACT_DOM_VARIABLE_NAME}'] = ReactDOM;
window['${blockCliConfigSettings.GLOBAL_REACT_DOM_SERVER_VARIABLE_NAME}'] = ReactDOMServer;

var didRun = false;
window['${blockCliConfigSettings.GLOBAL_RUN_BLOCK_FUNCTION_NAME}'] = function runBlock() {
    if (didRun) {
        console.log('Refusing to re-run block');
        return;
    }
    didRun = true;
    ${
        isDevelopment
            ? // In development mode, make sure requests to relative paths get
              // routed to the local backend (instead of the block router).
              `
        var blockUrl = process.env.BLOCK_BASE_URL;

        // Make requests to local backend.
        var baseTag = document.createElement('base');
        baseTag.setAttribute('href', blockUrl);
        document.head.appendChild(baseTag);
        `
            : ''
    }
    // Requiring the entry point file runs user code. Be sure to do any setup
    // above this line.
    var BlockWrapperComponent = window['${
        blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME
    }'].__BlockWrapperComponent;
    var EntryComponent = require(${JSON.stringify(frontendEntryModulePath)}).default;

    var isEntryReactComponent = EntryComponent && (
        EntryComponent.prototype instanceof React.Component ||
        EntryComponent instanceof Function
    );
    if (isEntryReactComponent) {
        console.log(\`
************************************************
** DEPRECATION WARNING: USING OLD ENTRY POINT **
************************************************
\`);
        var container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(React.createElement(BlockWrapperComponent, {
            EntryComponent: EntryComponent,
        }), container);
    }
};
`;
};
