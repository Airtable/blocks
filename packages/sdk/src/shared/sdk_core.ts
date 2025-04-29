import {SdkMode} from '../sdk_mode';
import GlobalConfig from './global_config';
import {AppInterface} from './types/airtable_interface_core';
import {BlockInstallationId} from './types/hyper_ids';

/**
 * @hidden
 * @example
 * ```js
 * import {runInfo} from '@airtable/blocks';
 * if (runInfo.isFirstRun) {
 *     // The current user just installed this block.
 *     // Take the opportunity to show any onboarding and set
 *     // sensible defaults if the user has permission.
 *     // For example, if the block relies on a table, it would
 *     // make sense to set that to cursor.activeTableId
 * }
 * ```
 */
export interface RunInfo {
    isFirstRun: boolean;
    isDevelopmentMode: boolean;
    intentData: unknown;
}

/** @hidden */
export abstract class BlockSdkCore<SdkModeT extends SdkMode> {
    /**
     * This value is used by the blocks-testing library to verify
     * compatibility.
     *
     * @hidden
     */
    // @ts-ignore
    static VERSION = global.PACKAGE_VERSION;

    /** Storage for this block installation's configuration. */
    globalConfig: GlobalConfig;

    /** Contains information about the current session. */
    session: SdkModeT['SessionT'];

    /** Represents the current Airtable {@link Base}. */
    base: SdkModeT['BaseT'];

    /**
     * Returns the ID for the current block installation.
     *
     * @example
     * ```js
     * import {installationId} from '@airtable/blocks';
     * console.log(installationId);
     * // => 'blifDutUr92OKwnUn'
     * ```
     */
    installationId: BlockInstallationId;

    /** @hidden */
    runInfo: RunInfo;

    /** @internal */
    __airtableInterface: SdkModeT['AirtableInterfaceT'];

    /** @internal */
    __mutations: SdkModeT['MutationsModelT'];

    /** @hidden */
    constructor(airtableInterface: SdkModeT['AirtableInterfaceT']) {
        this.__airtableInterface = airtableInterface;

        // @ts-ignore
        airtableInterface.assertAllowedSdkPackageVersion(global.PACKAGE_NAME, BlockSdkCore.VERSION);

        const sdkInitData = airtableInterface.sdkInitData;
        this.globalConfig = new GlobalConfig(sdkInitData.initialKvValuesByKey, this);
        this.installationId = sdkInitData.blockInstallationId;
        this.runInfo = Object.freeze({
            isFirstRun: sdkInitData.isFirstRun,
            isDevelopmentMode: sdkInitData.isDevelopmentMode,
            intentData: sdkInitData.intentData,
        });

        this.session = this._constructSession();
        this.base = this._constructBase();
        this.__mutations = this._constructMutations();

        this.reload = this.reload.bind(this);
    }

    /** @internal */
    abstract _constructSession(): SdkModeT['SessionT'];
    /** @internal */
    abstract _constructBase(): SdkModeT['BaseT'];
    /** @internal */
    abstract _constructMutations(): SdkModeT['MutationsModelT'];

    /**
     * Call this function to reload your block.
     *
     * @example
     * ```js
     * import React from 'react';
     * import {reload} from '@airtable/blocks';
     * import {Button, initializeBlock} from '@airtable/blocks/ui';
     * function MyBlock() {
     *     return <Button onClick={() => reload()}>Reload</Button>;
     * }
     * initializeBlock(() => <MyBlock />);
     * ```
     */
    reload() {
        this.__airtableInterface.reloadFrame();
    }

    /**
     * @internal
     */
    get __appInterface(): AppInterface {
        return this.base._baseData.appInterface;
    }
}
