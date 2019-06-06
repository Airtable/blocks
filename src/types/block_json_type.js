// @flow

import type {BlockModuleWithoutCode} from './block_module_types';
import type {Environment} from './environments';

/**
 * @deprecated in favor of BlockJsonNew. This will be removed and
 *     replaced once all usages have been refactored, and we'll
 *     eventually rename BlockJsonNew to be BlockJson.
 *
 * // TODO(richsinn): Remove, and replace with BlockJsonNew, and rename BlockJsonNew to BlockJson
 *
 * @see BlockJsonNew
 */
export type BlockJson = {|
    frontendEntryModuleName: string,
    environment?: Environment,
    applicationId: string,
    blockId: string,
    modules: Array<BlockModuleWithoutCode>,
|};
