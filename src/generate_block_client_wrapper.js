// @flow
const blockCliConfigSettings = require('./config/block_cli_config_settings');
const ErrorCodes = require('./types/error_codes');

module.exports = function generateBlockClientWrapperCode(frontendEntryModulePath: string, isDevelopment: boolean): string {
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
            ${isDevelopment ?
                // In development mode, make sure requests to relative paths get
                // routed to the local backend (instead of the block router).
                `
                var blockUrl = process.env.BLOCK_BASE_URL;

                // Make requests to local backend.
                var baseTag = document.createElement('base');
                baseTag.setAttribute('href', blockUrl);
                document.head.appendChild(baseTag);
                `
            : ''}
            // Requiring the entry point file runs user code. Be sure to do any setup
            // above this line.
            var BlockWrapperComponent = window['${
                blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME
            }'].__BlockWrapperComponent;
            var EntryComponent = require('${frontendEntryModulePath}').default;

            var isEntryReactComponent = EntryComponent && (
                EntryComponent.prototype instanceof React.Component ||
                EntryComponent instanceof Function
            );
            if (isEntryReactComponent) {
                var container = document.createElement('div');
                document.body.appendChild(container);
                ReactDOM.render(React.createElement(BlockWrapperComponent, {
                    EntryComponent: EntryComponent,
                }), container);
            }
            
            ${isDevelopment ?
                `
                function hackySyntaxErrorOverlayDiv(errStackHtml) {
                    var errorDiv = document.getElementById('error-div');
                    if (errorDiv !== null) {
                        // Remove any existing overlays so that it can be
                        // replaced with a new one.
                        document.body.removeChild(errorDiv);
                    }
                    errorDiv = document.createElement('div')
                    errorDiv.setAttribute('id', 'error-div');

                    // Styling info for errorDiv container overlay
                    errorDiv.style.position = 'fixed';
                    errorDiv.style.top = 0;
                    errorDiv.style.left = 0;
                    errorDiv.style.right = 0;
                    errorDiv.style.bottom = 0;
                    errorDiv.style.zIndex = 9999;
                    errorDiv.style.backgroundColor = '#fff';
                    errorDiv.style.padding = '16px';

                    var title = document.createElement('h3');
                    title.innerText = 'Syntax error';
                    errorDiv.appendChild(title);

                    var preContainer = document.createElement('div');
                    preContainer.style.backgroundColor = '#e6e6e6';
                    preContainer.style.padding = '8px';
                    preContainer.style.marginTop = '8px';
                    preContainer.style.overflow = 'auto';
                    preContainer.innerHTML = errStackHtml;
                    errorDiv.appendChild(preContainer);

                    document.body.appendChild(errorDiv);
                }

                function pollForLiveReload() {
                    // There seems to be a bug where Chrome tries to batch requests to the
                    // same URL, but only one iframe will get the response. We get around it
                    // by adding a random query param to each request. Otherwise, if multiple
                    // dev iframes are running, only one of them will live reload.
                    fetch(blockUrl + '/__runFrame/poll?random=' + Math.random()).then(function(response) {
                        if (response.status === 200) {
                            window['${blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME}'].reload();
                        } else if (response.status === 408) {
                            pollForLiveReload();
                        } else if (response.status === 500) {
                            return response.json().then((json) => {
                                if (json.code === '${ErrorCodes.BUNDLE_ERROR}' && json.errStackHtml) {
                                    hackySyntaxErrorOverlayDiv(json.errStackHtml);

                                    // We only want to keep the polling connection alive
                                    // for syntax errors in the block user code. Syntax
                                    // errors are defined as HTTP status 500 with
                                    // the 'BUNDLE_ERROR' error code.
                                    pollForLiveReload();
                                } else {
                                    throw new Error('Unknown 500 error from development server');
                                }
                            });
                        } else {
                            throw new Error('Unknown error from development server');
                        }
                    }).catch(err => {
                        setTimeout(() => {
                            throw new Error('Disconnected from development server');
                        });
                    });
                }
                pollForLiveReload();
                `
            : ''}
        };
    `;
};
