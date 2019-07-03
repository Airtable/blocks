"use strict";
var blockCliConfigSettings = require('./config/block_cli_config_settings');
var ErrorCodes = require('./types/error_codes');

module.exports = function generateBlockClientWrapperCode(frontendEntryModulePath, isDevelopment) {
  // NOTE: this must return ES5 (so no JSX!) since it won't get transpiled on the client.
  // This puts React on window so the block SDK can access it.
  return "\n        var ReactDOM = require('react-dom');\n        var React = require('react');\n        var ReactDOMServer = require('react-dom/server');\n\n        window['".concat(




  blockCliConfigSettings.GLOBAL_REACT_VARIABLE_NAME, "'] = React;\n        window['").concat(
  blockCliConfigSettings.GLOBAL_REACT_DOM_VARIABLE_NAME, "'] = ReactDOM;\n        window['").concat(
  blockCliConfigSettings.GLOBAL_REACT_DOM_SERVER_VARIABLE_NAME, "'] = ReactDOMServer;\n\n        var didRun = false;\n        window['").concat(


  blockCliConfigSettings.GLOBAL_RUN_BLOCK_FUNCTION_NAME, "'] = function runBlock() {\n            if (didRun) {\n                console.log('Refusing to re-run block');\n                return;\n            }\n            didRun = true;\n            ").concat(





  isDevelopment ?
  // In development mode, make sure requests to relative paths get
  // routed to the local backend (instead of the block router).
  "\n                var blockUrl = process.env.BLOCK_BASE_URL;\n\n                // Make requests to local backend.\n                var baseTag = document.createElement('base');\n                baseTag.setAttribute('href', blockUrl);\n                document.head.appendChild(baseTag);\n                " :







  '', "\n            // Requiring the entry point file runs user code. Be sure to do any setup\n            // above this line.\n            var BlockWrapperComponent = window['").concat(



  blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME, "'].__BlockWrapperComponent;\n            var EntryComponent = require('").concat(

  frontendEntryModulePath, "').default;\n\n            var isEntryReactComponent = EntryComponent && (\n                EntryComponent.prototype instanceof React.Component ||\n                EntryComponent instanceof Function\n            );\n            if (isEntryReactComponent) {\n                var container = document.createElement('div');\n                document.body.appendChild(container);\n                ReactDOM.render(React.createElement(BlockWrapperComponent, {\n                    EntryComponent: EntryComponent,\n                }), container);\n            }\n            \n            ").concat(













  isDevelopment ? "\n                function hackySyntaxErrorOverlayDiv(errStackHtml) {\n                    var errorDiv = document.getElementById('error-div');\n                    if (errorDiv !== null) {\n                        // Remove any existing overlays so that it can be\n                        // replaced with a new one.\n                        document.body.removeChild(errorDiv);\n                    }\n                    errorDiv = document.createElement('div')\n                    errorDiv.setAttribute('id', 'error-div');\n\n                    // Styling info for errorDiv container overlay\n                    errorDiv.style.position = 'fixed';\n                    errorDiv.style.top = 0;\n                    errorDiv.style.left = 0;\n                    errorDiv.style.right = 0;\n                    errorDiv.style.bottom = 0;\n                    errorDiv.style.zIndex = 9999;\n                    errorDiv.style.backgroundColor = '#fff';\n                    errorDiv.style.padding = '16px';\n\n                    var title = document.createElement('h3');\n                    title.innerText = 'Syntax error';\n                    errorDiv.appendChild(title);\n\n                    var preContainer = document.createElement('div');\n                    preContainer.style.backgroundColor = '#e6e6e6';\n                    preContainer.style.padding = '8px';\n                    preContainer.style.marginTop = '8px';\n                    preContainer.style.overflow = 'auto';\n                    preContainer.innerHTML = errStackHtml;\n                    errorDiv.appendChild(preContainer);\n\n                    document.body.appendChild(errorDiv);\n                }\n\n                function pollForLiveReload() {\n                    // There seems to be a bug where Chrome tries to batch requests to the\n                    // same URL, but only one iframe will get the response. We get around it\n                    // by adding a random query param to each request. Otherwise, if multiple\n                    // dev iframes are running, only one of them will live reload.\n                    fetch(blockUrl + '/__runFrame/poll?random=' + Math.random()).then(function(response) {\n                        if (response.status === 200) {\n                            window['".concat(











































  blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME, "'].reload();\n                        } else if (response.status === 408) {\n                            pollForLiveReload();\n                        } else if (response.status === 500) {\n                            return response.json().then((json) => {\n                                if (json.code === '").concat(




  ErrorCodes.BUNDLE_ERROR, "' && json.errStackHtml) {\n                                    hackySyntaxErrorOverlayDiv(json.errStackHtml);\n\n                                    // We only want to keep the polling connection alive\n                                    // for syntax errors in the block user code. Syntax\n                                    // errors are defined as HTTP status 500 with\n                                    // the 'BUNDLE_ERROR' error code.\n                                    pollForLiveReload();\n                                } else {\n                                    throw new Error('Unknown 500 error from development server');\n                                }\n                            });\n                        } else {\n                            throw new Error('Unknown error from development server');\n                        }\n                    }).catch(err => {\n                        setTimeout(() => {\n                            throw new Error('Disconnected from development server');\n                        });\n                    });\n                }\n                pollForLiveReload();\n                ") :






















  '', "\n        };\n    ");


};