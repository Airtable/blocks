// @flow

// This returns a reference to the ReactDOM module that's included in the
// block bundle. Use this instead of requiring react-dom directly in the block SDK
// to avoid having two copies of ReactDOM running on the page, which breaks things.
// Note that this can be *any* version of ReactDOM, depending on what the user's
// block packages specify.

const blocksConfigSettings = require('client_server_shared/blocks/blocks_config_settings');
const ReactDOM = window[blocksConfigSettings.GLOBAL_REACT_DOM_VARIABLE_NAME];

// NOTE: we want to add an invariant here, but we cannot depend on ReactDOM being set
// until all the currently released blocks have been rebuilt.
// TODO(jb): after rebuilding all blocks, add back invariant here.

module.exports = ReactDOM;
