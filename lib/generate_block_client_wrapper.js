const blocksConfigSettings = require('../config/block_cli_config_settings');

module.exports = function generateBlockClientWrapperCode(frontendEntryModulePath) {
    // NOTE: this must return ES5 (so no JSX!) since it won't get transpiled on the client.
    // This puts React on window so the block SDK can access it.
    return `
        var ReactDOM = require('react-dom');
        var React = require('react');
        var ReactDOMServer = require('react-dom/server');

        window['${blocksConfigSettings.GLOBAL_REACT_VARIABLE_NAME}'] = React;
        window['${blocksConfigSettings.GLOBAL_REACT_DOM_VARIABLE_NAME}'] = ReactDOM;
        window['${blocksConfigSettings.GLOBAL_REACT_DOM_SERVER_VARIABLE_NAME}'] = ReactDOMServer;

        var didRun = false;
        window['${blocksConfigSettings.GLOBAL_RUN_BLOCK_FUNCTION_NAME}'] = function runBlock() {
            if (didRun) {
                console.log('Refusing to re-run block');
                return;
            }
            didRun = true;

            var blockUrl = process.env.BLOCK_BASE_URL;

            // Make requests to local backend.
            var baseTag = document.createElement('base');
            baseTag.setAttribute('href', blockUrl);
            document.head.appendChild(baseTag);

            // Requiring the entry point file runs user code. Be sure to do any setup
            // above this line.
            var BlockWrapperComponent = window['${
                blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME
            }'].__BlockWrapperComponent;
            var EntryComponent = require('${frontendEntryModulePath}').default;

            var container = document.createElement('div');
            document.body.appendChild(container);
            ReactDOM.render(React.createElement(BlockWrapperComponent, {
                EntryComponent: EntryComponent,
            }), container);

            function pollForLiveReload() {
                // There seems to be a bug where Chrome tries to batch requests to the
                // same URL, but only one iframe will get the response. We get around it
                // by adding a random query param to each request. Otherwise, if multiple
                // dev iframes are running, only one of them will live reload.
                fetch(blockUrl + '/__runFrame/poll?random=' + Math.random()).then(function(response) {
                    if (response.status === 200) {
                        window._airtableBlockSdk.reload();
                    } else if (response.status === 408) {
                        pollForLiveReload();
                    } else {
                        throw new Error('Unknow error from development server');
                    }
                }).catch(err => {
                    setTimeout(() => {
                        throw new Error('Disconnected from development server');
                    });
                });
            }
            pollForLiveReload();
        };
    `;
};
