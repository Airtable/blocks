// @flow

// This returns a reference to the React module that's included in the
// block bundle. Use this instead of requiring react directly in the block SDK
// to avoid having two copies of React running on the page, which breaks things.
// Note that this can be *any* version of React, depending on what the user's
// block packages specify.

/* ::
import * as FlowReact from 'react';
*/

const invariant = require('invariant');
const blocksConfigSettings = window.__requirePrivateModuleFromAirtable('client_server_shared/blocks/blocks_config_settings');
const React /* : null | typeof FlowReact */ =
    window[blocksConfigSettings.GLOBAL_REACT_VARIABLE_NAME];

invariant(React, 'React is not available on window');

module.exports = React;
