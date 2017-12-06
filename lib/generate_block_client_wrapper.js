const blocksConfigSettings = require('../config/block_cli_config_settings');

module.exports = function generateBlockClientWrapperCode(frontendEntryModulePath) {
    // NOTE: this must return ES5 (so no JSX!) since it won't get transpiled on the client.
    // This puts React on window so the block SDK can access it.
    return `
        var ReactDOM = require('react-dom');
        var React = require('react');

        window['${blocksConfigSettings.GLOBAL_REACT_VARIABLE_NAME}'] = React;
        window['${blocksConfigSettings.GLOBAL_REACT_DOM_VARIABLE_NAME}'] = ReactDOM;

        var didRun = false;
        window['${blocksConfigSettings.GLOBAL_RUN_BLOCK_FUNCTION_NAME}'] = function runBlock() {
            if (didRun) {
                console.log('Refusing to re-run block');
                return;
            }
            didRun = true;

            var BlockWrapperComponent = window['${blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME}'].__BlockWrapperComponent;
            var EntryComponent = require('${frontendEntryModulePath}').default;

            var container = document.createElement('div');
            document.body.appendChild(container);
            ReactDOM.render(React.createElement(BlockWrapperComponent, {
                EntryComponent: EntryComponent,
            }), container);

            var pollUrl = process.env.BLOCK_POLL_URL;

            function pollForLiveReload() {
                // Note: We add a 'random' query param to make each request slightly
                // different so that chrome doesn't try to batch requests
                // Also, we can conveniently use this to identify each request
                // uniquely in the server
                fetch(process.env.BLOCK_POLL_URL + '?random=' + Math.random()).then(function(response) {
                    if (response.status === 200) {
                        window._airtableBlockSdk.reload();
                    } else if (response.status === 502) {
                        pollForLiveReload();
                    } else {
                        throw new Error('Unknow error from local block build server');
                    }
                });
            }
            pollForLiveReload();
        };
    `;
}
