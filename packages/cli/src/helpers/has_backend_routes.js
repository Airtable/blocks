// @flow

import type {BlockJson} from '../types/block_json_type';

function hasBackendRoutes(blockJson: BlockJson): boolean %checks {
    return !!blockJson.routes && blockJson.routes.length > 0;
}

module.exports = hasBackendRoutes;
