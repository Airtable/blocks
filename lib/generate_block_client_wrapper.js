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
        };
            `;
}
