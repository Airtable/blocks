/** @module @airtable/blocks/models: Session */ /** */
import {invariant} from '../error_utils';
import {type CollaboratorData} from '../types/collaborator';
import {type PermissionLevel} from '../types/permission_levels';
import {isEnumValue, entries, type ObjectValues, type ObjectMap} from '../private_utils';
import {type UserId} from '../types/hyper_ids';
import {type SdkMode} from '../../sdk_mode';
import {type ModelChange} from '../types/base_core';
import AbstractModel from './abstract_model';

/** @hidden */
interface SessionData {
    currentUserId: UserId | null;
    permissionLevel: PermissionLevel;
    enabledFeatureNames: Array<string>;
}

const WatchableSessionKeys = Object.freeze({
    permissionLevel: 'permissionLevel' as const,

    currentUser: 'currentUser' as const,
});

/**
 * Watchable keys in {@link Session}.
 * - `currentUser`
 * - `permissionLevel`
 */
type WatchableSessionKey = ObjectValues<typeof WatchableSessionKeys>;

/** @hidden */
export abstract class SessionCore<SdkModeT extends SdkMode> extends AbstractModel<
    SdkModeT,
    SessionData,
    WatchableSessionKey
> {
    /** @internal */
    static _className = 'SessionCore';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableSessionKeys, key);
    }
    /** @internal */
    _airtableInterface: SdkModeT['AirtableInterfaceT'];
    /** @internal */
    _sessionData: SessionData;

    /**
     * @internal
     */
    constructor(sdk: SdkModeT['SdkT']) {
        super(sdk, 'session');
        this._airtableInterface = sdk.__airtableInterface;

        const {permissionLevel, currentUserId, enabledFeatureNames} =
            this._airtableInterface.sdkInitData.baseData;
        this._sessionData = {
            permissionLevel,
            currentUserId,
            enabledFeatureNames,
        };

        Object.seal(this);
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): SessionData {
        return this._sessionData;
    }

    /**
     * The current user, or `null` if the extension is running in a publicly shared base.
     *
     * @example
     * ```js
     * import {useSession} from '@airtable/blocks/[placeholder-path]/ui';
     *
     * function CurrentUser() {
     *     const session = useSession();
     *
     *     if (!session.currentUser) {
     *         return <div>This extension is being used in a public share.</div>;
     *     }
     *
     *     return <ul>
     *         <li>ID: {session.currentUser.id}</li>
     *         <li>E-mail: {session.currentUser.email}</li>
     *         <li>Name: {session.currentUser.name}</li>
     *     </ul>;
     * }
     * ```
     */
    get currentUser(): CollaboratorData | null {
        const userId = this._sessionData.currentUserId;
        if (!userId) {
            return null;
        } else {
            const {base} = this._sdk;
            return base.getCollaboratorByIdIfExists(userId);
        }
    }
    /**
     * Returns true if `featureName` is enabled and automatically tracks an exposure.
     *
     * @internal
     */
    __isFeatureEnabled(featureName: string): boolean {
        this._airtableInterface.trackExposure(featureName);
        return this.__peekIfFeatureIsEnabled(featureName);
    }

    /**
     * Returns true if `featureName` is enabled; does not track an exposure.
     *
     * @internal
     */
    __peekIfFeatureIsEnabled(featureName: string): boolean {
        return this._sessionData.enabledFeatureNames.includes(featureName);
    }

    /**
     * @internal
     */
    __applyChangesWithoutTriggeringEvents(
        changes: ReadonlyArray<ModelChange>,
    ): ObjectMap<WatchableSessionKey, boolean> {
        const changedKeys = {
            [WatchableSessionKeys.permissionLevel]: false,
            [WatchableSessionKeys.currentUser]: false,
        };
        for (const {path, value} of changes) {
            if (path[0] === 'permissionLevel') {
                invariant(path.length === 1, 'cannot set within permissionLevel');

                invariant(typeof value === 'string', 'permissionLevel must be a string');

                this._sessionData.permissionLevel = value as any;
                changedKeys[WatchableSessionKeys.permissionLevel] = true;
            }

            if (path[0] === 'collaboratorsById') {
                changedKeys[WatchableSessionKeys.currentUser] = true;
            }
        }

        return changedKeys;
    }
    /**
     * @internal
     */
    __triggerOnChangeForChangedKeys(changedKeys: ObjectMap<WatchableSessionKey, boolean>) {
        for (const [key, didChange] of entries(changedKeys)) {
            if (didChange) {
                this._onChange(key);
            }
        }
    }
}
