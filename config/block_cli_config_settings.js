module.exports = {
    // The name to `import` when referencing the blocks sdk.
    SDK_PACKAGE_NAME: 'airtable-block',

    // These global variables will be set on `window` in the block frame.
    // Careful: if you change any of these, you will break blocks that are
    // already released, since the values will  be hardcoded in those bundles.
    GLOBAL_SDK_VARIABLE_NAME: '_airtableBlockSdk',
    GLOBAL_REACT_VARIABLE_NAME: '_airtableReact',
    GLOBAL_REACT_DOM_VARIABLE_NAME: '_airtableReactDOM',
    GLOBAL_REACT_DOM_SERVER_VARIABLE_NAME: '_airtableReactDOMServer',
    GLOBAL_RUN_BLOCK_FUNCTION_NAME: '_airtableRunBlock',

    // Metadata file for the block cli.
    BLOCK_FILE_NAME: 'block.json',

    // File to store the airtable api key.
    AIRTABLE_API_KEY_FILE_NAME: '.airtableAPIKey',

    // Build directory for frontend bundle and transpiled backend code.
    BUILD_DIR: 'build',

    // Wrapper file for blocks frontend code.
    CLIENT_WRAPPER_FILE_NAME: 'block_client_wrapper.js',

    // Bundle file.
    BUNDLE_FILE_NAME: 'bundle.js',
};
