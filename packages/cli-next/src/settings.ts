/** Application configuration. */
export const BLOCK_FILE_NAME = 'block.json';

/** Directory in Airtable application containing per application configuration. */
export const BLOCK_CONFIG_DIR_NAME = '.block';

export const REMOTE_JSON_BASE_FILE_PATH = 'remote.json';

/** CLI user configuration file saved globally or per application. */
export const USER_CONFIG_FILE_NAME = '.airtableblocksrc.json';

export const INIT_DEFAULT_TEMPLATE_URL = 'https://github.com/Airtable/blocks-hello-world';

export const APP_ROOT_TEMPORARY_DIR = '.tmp';

export const APP_RELEASE_DIR = 'dist';

export const BUNDLE_FILE_NAME = 'bundle.js';

export const AIRTABLE_API_URL = 'https://api.airtable.com';

// These global variables will be set on `window` in the block frame.
// Careful: if you change any of these, you will break blocks that are
// already released, since the values will  be hardcoded in those bundles.
export const GLOBAL_REACT_VARIABLE_NAME = '_airtableReact';
export const GLOBAL_REACT_DOM_VARIABLE_NAME = '_airtableReactDOM';
export const GLOBAL_REACT_DOM_SERVER_VARIABLE_NAME = '_airtableReactDOMServer';
export const GLOBAL_RUN_BLOCK_FUNCTION_NAME = '_airtableRunBlock';
export const GLOBAL_BLOCK_CODE_VERSION_VARIABLE_NAME = '_airtableBlockCodeVersion';
