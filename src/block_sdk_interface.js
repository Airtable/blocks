// @flow
const models = require('./models/models');

import type {AbstractAirtableInterface} from './abstract_airtable_interface';
import type Base from './models/base';
import type GlobalConfig from './global_config';

/**
 * @example
 * import {runInfo} from 'airtable-block';
 * if (runInfo.isFirstRun) {
 *     // The current user just installed this block.
 *     // Take the opportunity to show any onboarding and set
 *     // sensible defaults if the user has permission.
 *     // For example, if the block relies on a table, it would
 *     // make sense to set that to base.activeTable
 * }
 */
export type RunInfo = {
    isFirstRun: boolean,
    isDevelopmentMode: boolean,
};

export interface BlockSdkInterface<AirtableInterface: AbstractAirtableInterface> {
    __airtableInterface: AirtableInterface;
    globalConfig: GlobalConfig;
    base: Base;
    models: typeof models;
    installationId: string;
    runInfo: RunInfo;
}
