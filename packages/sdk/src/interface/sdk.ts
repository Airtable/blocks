import {type ModelChange} from '../shared/types/base_core';
import {type GlobalConfigUpdate} from '../shared/types/global_config';
import {BlockSdkCore} from '../shared/sdk_core';
import {type InterfaceSdkMode} from '../sdk_mode';
import {type AppInterface} from '../shared/types/airtable_interface_core';
import {Session} from './models/session';
import {Mutations} from './models/mutations';
import {Base} from './models/base';
import {
    type BlockInstallationPageElementCustomPropertyForAirtableInterface,
    type BlockRunContext,
} from './types/airtable_interface';

/** @hidden */
export class InterfaceBlockSdk extends BlockSdkCore<InterfaceSdkMode> {
    constructor(airtableInterface: InterfaceSdkMode['AirtableInterfaceT']) {
        super(airtableInterface);

        this._registerHandlers();
    }
    /** @internal */
    _constructSession(): Session {
        return new Session(this);
    }
    /** @internal */
    _constructBase(): Base {
        return new Base(this);
    }
    /** @internal */
    _constructMutations() {
        return new Mutations(
            this,
            this.session,
            this.base,
            (changes) => this.__applyModelChanges(changes),
            (updates) => this.__applyGlobalConfigUpdates(updates),
        );
    }
    /** @internal */
    _registerHandlers() {
        this.__airtableInterface.subscribeToModelUpdates(({changes}) => {
            this.__applyModelChanges(changes);
        });

        this.__airtableInterface.subscribeToGlobalConfigUpdates(({updates}) => {
            this.__applyGlobalConfigUpdates(updates);
        });
    }
    /** @internal */
    __applyModelChanges(changes: ReadonlyArray<ModelChange>) {
        const changedBasePaths = this.base.__applyChangesWithoutTriggeringEvents(changes);
        const changedSessionKeys = this.session.__applyChangesWithoutTriggeringEvents(changes);
        this.base.__triggerOnChangeForChangedPaths(changedBasePaths);
        this.session.__triggerOnChangeForChangedKeys(changedSessionKeys);
    }
    /** @internal */
    __applyGlobalConfigUpdates(updates: ReadonlyArray<GlobalConfigUpdate>) {
        this.globalConfig.__setMultipleKvPaths(updates);
    }

    /**
     * @internal
     */
    get __appInterface(): AppInterface {
        return this.base._baseData.appInterface;
    }

    /** @hidden */
    getBlockRunContext(): BlockRunContext {
        return this.__airtableInterface.sdkInitData.runContext;
    }

    /**
     * @internal
     */
    setCustomPropertiesAsync(
        properties: Array<BlockInstallationPageElementCustomPropertyForAirtableInterface>,
    ): Promise<boolean> {
        return this.__airtableInterface.setCustomPropertiesAsync(properties);
    }
}
