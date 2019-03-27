// @flow

import type {BlockModuleWithoutCode} from './block_module_types';

export type BlockFile = {|
    frontendEntryModuleName: string,
    environment?: 'production' | 'staging' | 'local',
    applicationId: string,
    blockId: string,
    modules: Array<BlockModuleWithoutCode>,
|}
