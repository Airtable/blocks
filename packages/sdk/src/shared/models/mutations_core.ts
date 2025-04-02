import {SdkMode} from '../../sdk_mode';
import {ModelChange} from '../types/base_core';
import {GlobalConfigUpdate} from '../types/global_config';
import {
    PermissionCheckResult,
    MutationTypesCore,
    SetMultipleGlobalConfigPathsMutation,
} from '../types/mutations_core';
import {spawnError} from '../error_utils';
import {AirtableInterfaceCore} from '../types/airtable_interface_core';

// Limit for how many items can be updated from a single batch mutation.
// This is number of records for MULTIPLE_RECORDS type mutations, and number of global config paths
// for SET_MULTIPLE_GLOBAL_CONFIG_PATHS.
// Same limit is enforced liveapp-side
export const MUTATIONS_MAX_BATCH_SIZE = 50;

// Liveapp requests must be under 2mb in size: we enforce a 1.9mb limit here to allow space for
// the other parts of the request
const MUTATIONS_MAX_BODY_SIZE = 1.9 * 1024 * 1024;

const MUTATION_HOLD_FOR_MS = 100;

/** @hidden */
export abstract class MutationsCore<SdkModeT extends SdkMode> {
    /** @internal */
    _airtableInterface: SdkModeT['AirtableInterfaceT'];
    /** @internal */
    _session: SdkModeT['SessionT'];
    /** @internal */
    _sdk: SdkModeT['SdkT'];
    /** @internal */
    _base: SdkModeT['BaseT'];
    /** @internal */
    _applyModelChanges: (arg1: Array<ModelChange>) => void;
    /** @internal */
    _applyGlobalConfigUpdates: (arg1: ReadonlyArray<GlobalConfigUpdate>) => void;

    /** @hidden */
    constructor(
        sdk: SdkModeT['SdkT'],
        session: SdkModeT['SessionT'],
        base: SdkModeT['BaseT'],
        applyModelChanges: (arg1: ReadonlyArray<ModelChange>) => void,
        applyGlobalConfigUpdates: (arg1: ReadonlyArray<GlobalConfigUpdate>) => void,
    ) {
        this._airtableInterface = sdk.__airtableInterface;
        this._session = session;
        this._sdk = sdk;
        this._base = base;
        this._applyModelChanges = applyModelChanges;
        this._applyGlobalConfigUpdates = applyGlobalConfigUpdates;
    }

    /** @hidden */
    async applyMutationAsync(mutation: SdkModeT['MutationT']): Promise<void> {
        this._assertMutationIsValid(mutation);
        // Limit check is after validity check so that we display errors for when users pass in
        // objects correctly (eg updating linked records cell value to be a record object) -
        // otherwise the limit check will fail due to circular objects being converted to JSON first
        this._assertMutationUnderLimits(mutation);

        const permissionCheck = this.checkPermissionsForMutation(mutation);
        if (!permissionCheck.hasPermission) {
            throw spawnError(
                'Cannot apply %s mutation: %s',
                mutation.type,
                permissionCheck.reasonDisplayString,
            );
        }

        const didApplyOptimisticUpdates = this._applyOptimisticUpdatesForMutation(mutation);

        try {
            await this._getAirtableInterfaceAsAirtableInterfaceCore().applyMutationAsync(mutation, {
                holdForMs: MUTATION_HOLD_FOR_MS,
            });
        } catch (err) {
            if (didApplyOptimisticUpdates) {
                // if we applied optimistic updates, we can't gracefully handle a promise rejection
                // here - we can't un-apply optimistic updates, so the SDK's internal data model is
                // in an unexpected state. Instead of letting this promise get rejected, throw an
                // error after an async gap to crash the block, and make this promise await
                // something that will never resolve so we don't run any of the developers error-
                // handling code.
                setTimeout(() => {
                    throw err;
                }, 0);
                await new Promise(() => {});
            } else {
                throw err;
            }
        }
    }

    /** @hidden */
    checkPermissionsForMutation(mutation: SdkModeT['PartialMutationT']): PermissionCheckResult {
        return this._getAirtableInterfaceAsAirtableInterfaceCore().checkPermissionsForMutation(
            mutation,
            this._base.__getBaseData(),
        );
    }

    // Not really sure why this is necessary. It seems like all callsites could just use
    // this._airtableInterface directly, but TS complains.
    /** @hidden */
    private _getAirtableInterfaceAsAirtableInterfaceCore(): AirtableInterfaceCore<SdkModeT> {
        return this._airtableInterface as AirtableInterfaceCore<SdkModeT>;
    }

    /** @internal */
    _assertMutationUnderLimits(mutation: SdkModeT['MutationT']) {
        // Two limits to check here:
        // - for record-related mutations, it isn't above MUTATIONS_MAX_BATCH_SIZE
        // - mutation payload size won't exceed liveapp request payload size limit
        // Requests are sent as form-encoded utf-8 (1 byte characters)
        if (encodeURIComponent(JSON.stringify(mutation)).length > MUTATIONS_MAX_BODY_SIZE) {
            throw spawnError(
                'Request exceeds maximum size limit of %s bytes',
                MUTATIONS_MAX_BODY_SIZE,
            );
        }

        if (this._doesMutationExceedBatchSizeLimit(mutation)) {
            throw spawnError(
                'Request exceeds maximum batch size limit of %s items',
                MUTATIONS_MAX_BATCH_SIZE,
            );
        }
    }

    /** @internal */
    _applyOptimisticUpdatesForMutation(mutation: SdkModeT['MutationT']): boolean {
        // GlobalConfig updates are different to other mutations (on models): for models, we
        // only apply optimistic updates if the relevant models are loaded, whereas for
        // SET_MULTIPLE_GLOBAL_CONFIG_PATHS we always apply optimistic updates.
        if (mutation.type === MutationTypesCore.SET_MULTIPLE_GLOBAL_CONFIG_PATHS) {
            // Not sure why this cast is necessary, but TS complains without it.
            const _mutation = mutation as SetMultipleGlobalConfigPathsMutation;
            this._applyGlobalConfigUpdates(_mutation.updates);
            return true;
        }

        const modelChanges = this._getOptimisticModelChangesForMutation(mutation);

        if (modelChanges.length > 0) {
            this._applyModelChanges(modelChanges);
            return true;
        }

        return false;
    }

    /** @internal */
    abstract _doesMutationExceedBatchSizeLimit(mutation: SdkModeT['MutationT']): boolean;
    /** @internal */
    abstract _assertMutationIsValid(mutation: SdkModeT['MutationT']): void;
    /** @internal */
    abstract _getOptimisticModelChangesForMutation(
        mutation: SdkModeT['MutationT'],
    ): Array<ModelChange>;
}
