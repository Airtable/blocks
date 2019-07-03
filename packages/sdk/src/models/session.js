// @flow
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import {type AirtableInterface} from '../injected/airtable_interface';
import {type BaseData, type ModelChange} from '../types/base';
import {type CollaboratorData, type UserId} from '../types/collaborator';
import {type PermissionLevel} from '../types/permission_levels';
import {isEnumValue, entries} from '../private_utils';
import AbstractModel from './abstract_model';

type SessionData = {
    currentUserId: UserId | null,
    permissionLevel: PermissionLevel,
    enabledFeatureNames: Array<string>,
};

const WatchableSessionKeys = Object.freeze({
    permissionLevel: ('permissionLevel': 'permissionLevel'),

    currentUser: ('currentUser': 'currentUser'),
});
type WatchableSessionKey = $Values<typeof WatchableSessionKeys>;

/**
 * Model class representing the current user's session.
 *
 * @example
 * import {session} from '@airtable/blocks';
 *
 * if (session.currentUser !== null) {
 *     console.log("The current user's name is", session.currentUser.name);
 * } else {
 *     console.log('This block is being viewed in a public share');
 * }
 */
class Session extends AbstractModel<SessionData, WatchableSessionKey> {
    static _className = 'Session';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableSessionKeys, key);
    }
    _airtableInterface: AirtableInterface;
    _sessionData: SessionData;

    /**
     * @hideconstructor
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
     * @param {Object?} [context] an optional context for `this` in `callback`.
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
     * @param {Object?} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableSessionKey>} the array of keys that were unwatched
     */

    /**
     * @private
     */
    get _dataOrNullIfDeleted(): SessionData {
        return this._sessionData;
    }

    /**
     * @function
     * @returns The current user, or `null` if the block is running in a publicly shared base.
     * @example
     * import {session} from '@airtable/blocks';
     * if (session.currentUser) {
     *     console.log(session.currentUser.id);
     *     console.log(session.currentUser.email);
     *     console.log(session.currentUser.name);
     * }
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
     * @private
     */
    get __currentUserId(): UserId | null {
        return this._sessionData.currentUserId;
    }
    /**
     * @private
     */
    get __rawPermissionLevel(): PermissionLevel {
        return this._sessionData.permissionLevel;
    }
    /**
     * @private
     */
    __isFeatureEnabled(featureName: string): boolean {
        return this._sessionData.enabledFeatureNames.includes(featureName);
    }

    /**
     * @private
     */
    __applyChangesWithoutTriggeringEvents(
        changes: Array<ModelChange>,
    ): {[WatchableSessionKey]: boolean} {
        const changedKeys = {
            [WatchableSessionKeys.permissionLevel]: false,
            [WatchableSessionKeys.currentUser]: false,
        };
        for (const {path, value} of changes) {
            if (path[0] === 'permissionLevel') {
                invariant(path.length === 1, 'cannot set within permissionLevel');

                invariant(typeof value === 'string', 'permissionLevel must be a string');
                this._sessionData.permissionLevel = (value: any); // eslint-disable-line flowtype/no-weak-types
                changedKeys[WatchableSessionKeys.permissionLevel] = true;
            }

            if (path[0] === 'appBlanket') {
                changedKeys[WatchableSessionKeys.currentUser] = true;
            }
        }

        return changedKeys;
    }
    /**
     * @private
     */
    __triggerOnChangeForChangedKeys(changedKeys: {[WatchableSessionKey]: boolean}) {
        for (const [key, didChange] of entries(changedKeys)) {
            if (didChange) {
                this._onChange(key);
            }
        }
    }
}

export default Session;
