/** @module @airtable/blocks/models: Session */ /** */
import {spawnInvariantViolationError} from '../error_utils';
import getSdk from '../get_sdk';
import {AirtableInterface} from '../injected/airtable_interface';
import {BaseData, ModelChange} from '../types/base';
import {CollaboratorData, UserId} from '../types/collaborator';
import {PermissionLevel} from '../types/permission_levels';
import {isEnumValue, entries, ObjectValues, ObjectMap} from '../private_utils';
import AbstractModel from './abstract_model';

type SessionData = {
    // currentUserId will be null for backend block requests and publicly shared bases.
    currentUserId: UserId | null;
    permissionLevel: PermissionLevel;
    enabledFeatureNames: Array<string>;
};

const WatchableSessionKeys = Object.freeze({
    permissionLevel: 'permissionLevel' as const,

    // NOTE: the current user's identity will never change, but their name/email/profile pic/etc. can.
    currentUser: 'currentUser' as const,
});
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
     * Get notified of changes to the session.
     *
     * Watchable keys are:
     * - `'permissionLevel'`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @function watch
     * @memberof Session
     * @instance
     * @param {(WatchableSessionKey|Array<WatchableSessionKey>)} keys the keys to watch
     * @param {Function} callback a function to call when those keys change
     * @param {?object} [context] an optional context for `this` in `callback`.
     * @returns {Array<WatchableSessionKey>} the array of keys that were watched
     */

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @function unwatch
     * @memberof Session
     * @instance
     * @param {(WatchableSessionKey|Array<WatchableSessionKey>)} keys the keys to unwatch
     * @param {Function} callback the function passed to `.watch` for these keys
     * @param {?object} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableSessionKey>} the array of keys that were unwatched
     */

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): SessionData {
        return this._sessionData;
    }

    /**
     * @function
     * @returns The current user, or `null` if the block is running in a publicly shared base.
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
                if (!(path.length === 1)) {
                    throw spawnInvariantViolationError('cannot set within permissionLevel');
                }

                // NOTE: just verify that the permission level is a string (rather than
                // checking isEnumValue against PermissionLevels) in case new permission
                // levels are added on the liveapp side. Permissions behavior gets routed
                // through the checkPermissionsForMutation AirtableInterface helper, so we
                // should still be able to handle unknown permission levels.
                if (!(typeof value === 'string')) {
                    throw spawnInvariantViolationError('permissionLevel must be a string');
                }
                this._sessionData.permissionLevel = value as any;
                changedKeys[WatchableSessionKeys.permissionLevel] = true;
            }

            // TODO(emma): Check for collaboratorsById change instead
            if (path[0] === 'appInterface') {
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
