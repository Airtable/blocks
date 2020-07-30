// @flow
const os = require('os');
const path = require('path');
const UserAgentBag = require('user-agent-bag');
const getBlocksCliProjectRootPath = require('../helpers/get_blocks_cli_project_root_path');
// flow-disable-next-line
const packageJson = require(path.join(getBlocksCliProjectRootPath(), 'package.json'));

module.exports = {
    // The name of the blocks sdk.
    SDK_PACKAGE_NAME: '@airtable/blocks',

    // These global variables will be set on `window` in the block frame.
    // Careful: if you change any of these, you will break blocks that are
    // already released, since the values will  be hardcoded in those bundles.
    GLOBAL_SDK_VARIABLE_NAME: '_airtableBlockSdk',
    GLOBAL_REACT_VARIABLE_NAME: '_airtableReact',
    GLOBAL_REACT_DOM_VARIABLE_NAME: '_airtableReactDOM',
    GLOBAL_REACT_DOM_SERVER_VARIABLE_NAME: '_airtableReactDOMServer',
    GLOBAL_RUN_BLOCK_FUNCTION_NAME: '_airtableRunBlock',

    // Blocks currently run on node 8.10 in production.
    BLOCK_NODE_VERSION: '8.10',

    // Metadata file for the block cli.
    BLOCK_FILE_NAME: 'block.json',

    // Directory for block-scoped config.
    BLOCK_CONFIG_DIR_NAME: '.block',

    REMOTE_JSON_BASE_FILE_PATH: 'remote.json',

    // Copied over from blockRouterConfigSettings.REQUEST_BODY_LIMIT
    // in the hyperbase codebase
    BLOCK_REQUEST_BODY_LIMIT: 5.2 * 1024 * 1024, // 5.2MB

    // The request user agent.
    USER_AGENT: new UserAgentBag([
        ['airtable-blocks-cli', packageJson.version],
        ['Node', process.version.substring(1)],
        ['OS', process.platform],
    ]).toString(),

    // Root temporary directory used by the CLI.
    TEMP_DIR_PATH: path.join(os.tmpdir(), 'airtableBlocks'),

    // Build directory for the user's block code (including frontend bundle and transpiled backend code).
    BUILD_DIR: 'build',

    // Wrapper file for blocks frontend code.
    CLIENT_WRAPPER_FILE_NAME: 'block_client_wrapper.js',

    // Bundle files.
    BUNDLE_FILE_NAME: 'bundle.js',
    BACKEND_BUNDLE_FILE_NAME: 'backend-bundle.zip',

    AIRTABLE_ACCOUNT_URL: 'https://airtable.com/account',

    AIRTABLE_API_URL: 'https://api.airtable.com',

    TEST_SERVER_PORT: 7132,

    // This access token is not considered sensitive.
    ROLLBAR_ACCESS_TOKEN: '2de7b9533b7243f7989e3a7584c7dad7',

    // Name of the file used to store user/blocks scoped configs for blocks-cli
    CONFIG_FILE_NAME: '.airtableblocksrc.json',

    // Default server providing backend SDK.
    BACKEND_SDK_BASE_URL: 'https://airtable.com',
    // URL path to backend SDK.
    BACKEND_SDK_URL_PATH: '/js/compiled/block_backend_sdk.js',
    // Module path to backend SDK.
    BACKEND_SDK_MODULE: 'block_backend_sdk',
    // How long to cache downloaded backend SDK file on local disk, in milliseconds.
    BACKEND_SDK_CACHE_TTL_MS: 24 * 60 * 60 * 1000, // 1 day

    // Directory path of blocks backend wrapper in backend bundle.
    BACKEND_WRAPPER_DIR: 'backend_wrapper',

    HELLO_WORLD_TEMPLATE_URL: 'https://github.com/Airtable/blocks-hello-world',
};
