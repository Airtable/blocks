// @flow

import type {BlockModuleWithoutCode} from './block_module_types';
import type {Environment} from './environments';

export type BlockJson = {|
    frontendEntryModuleName: string,
    environment?: Environment,
    applicationId: string,
    blockId: string,
    modules: Array<BlockModuleWithoutCode>,
|};
