/** @module @airtable/blocks/models: Session */ /** */
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import {AirtableInterface} from '../types/airtable_interface';
import {BaseData, ModelChange} from '../types/base';
import {CollaboratorData, UserId} from '../types/collaborator';
import {PermissionLevel} from '../types/permission_levels';
import {isEnumValue, entries, ObjectValues, ObjectMap} from '../private_utils';
import {PermissionCheckResult, MutationTypes} from '../types/mutations';
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

/**
 * Model class representing the current user's session.
 *
 * @example
 * ```js
 * import {session} from '@airtable/blocks';
 *
 * if (session.currentUser !== null) {
 *     console.log("The current user's name is", session.currentUser.name);
 * } else {
 *     console.log('This block is being viewed in a public share');
 * }
 * ```
 * @docsPath models/Session
 */
class Session extends AbstractModel<SessionData, WatchableSessionKey> {
    /** @internal */
    static _className = 'Session';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableSessionKeys, key);
    }
    /** @internal */
    _airtableInterface: AirtableInterface;
    /** @internal */
    _sessionData: SessionData;

    /**
     * @internal
     */
    constructor(baseData: BaseData, airtableInterface: AirtableInterface) {
        super(baseData, 'session');
        this._airtableInterface = airtableInterface;

        const {permissionLevel, currentUserId, enabledFeatureNames} = baseData;
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
     * The current user, or `null` if the block is running in a publicly shared base.
     *
     * @example
     * ```js
     * import {session} from '@airtable/blocks';
     * if (session.currentUser) {
     *     console.log(session.currentUser.id);
     *     console.log(session.currentUser.email);
     *     console.log(session.currentUser.name);
     * }
     * ```
     */
    get currentUser(): CollaboratorData | null {
        const userId = this._sessionData.currentUserId;
        if (!userId) {
            return null;
        } else {
            const {base} = getSdk();
            return base.getCollaboratorByIdIfExists(userId);
        }
    }
    /**
     * Checks whether the current user has permission to update any records in the current base. For
     * more granular permission checks, see {@link Table.checkPermissionsForUpdateRecords}.
     *
     * Returns `{hasPermission: true}` if the current user can update records,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may
     * be used to display an error message to the user.
     *
     * @example
     * ```js
     * import {session} from '@airtable/blocks';
     *
     * const updateRecordsCheckResult = session.checkPermissionsForUpdateRecords();
     * if (!updateRecordsCheckResult.hasPermission) {
     *     alert(updateRecordsCheckResult.reasonDisplayString);
     * }
     */
    checkPermissionsForUpdateRecords(): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
            tableId: undefined,
            records: undefined,
        });
    }
    /**
     * An alias for `session.checkPermissionsForUpdateRecords().hasPermission`. For more granular
     * permission checks, see {@link Table.hasPermissionToUpdateRecords}.
     */
    hasPermissionToUpdateRecords(): boolean {
        return this.checkPermissionsForUpdateRecords().hasPermission;
    }
    /**
     * Checks whether the current user has permission to create any records in the current base. For
     * more granular permission checks, see {@link Table.checkPermissionsForCreateRecords}.
     *
     * Returns `{hasPermission: true}` if the current user can create records,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @example
     * ```js
     * import {session} from '@airtable/blocks';
     *
     * const createRecordsCheckResult = session.checkPermissionsForCreateRecords();
     * if (!createRecordsCheckResult.hasPermission) {
     *     alert(createRecordsCheckResult.reasonDisplayString);
     * }
     */
    checkPermissionsForCreateRecords(): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.CREATE_MULTIPLE_RECORDS,
            tableId: undefined,
            records: undefined,
        });
    }
    /**
     * An alias for `session.checkPermissionsForCreateRecords().hasPermission`. For more granular
     * permission checks, see {@link Table.hasPermissionToCreateRecords}.
     */
    hasPermissionToCreateRecords(): boolean {
        return this.checkPermissionsForCreateRecords().hasPermission;
    }
    /**
     * Checks whether the current user has permission to delete any records in the current base. For
     * more granular permission checks, see {@link Table.checkPermissionsForDeleteRecords}.
     *
     * Returns `{hasPermission: true}` if the current user can delete records,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @example
     * ```js
     * import {session} from '@airtable/blocks';
     *
     * const deleteRecordsCheckResult = session.checkPermissionsForDeleteRecords();
     * if (!deleteRecordsCheckResult.hasPermission) {
     *     alert(deleteRecordsCheckResult.reasonDisplayString);
     * }
     */
    checkPermissionsForDeleteRecords(): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.DELETE_MULTIPLE_RECORDS,
            tableId: undefined,
            recordIds: undefined,
        });
    }
    /**
     * An alias for `session.checkPermissionsForDeleteRecords().hasPermission`. For more granular
     * permission checks, see {@link Table.hasPermissionToDeleteRecords}.
     */
    hasPermissionToDeleteRecords(): boolean {
        return this.checkPermissionsForDeleteRecords().hasPermission;
    }
    /**
     * @internal
     */
    get __currentUserId(): UserId | null {
        return this._sessionData.currentUserId;
    }
    /**
     * @internal
     */
    get __rawPermissionLevel(): PermissionLevel {
        return this._sessionData.permissionLevel;
    }
    /**
     * @internal
     */
    __isFeatureEnabled(featureName: string): boolean {
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

export default Session;
