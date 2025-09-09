import {type BaseSdkMode} from '../../sdk_mode';
import {SessionCore} from '../../shared/models/session_core';
import {type PermissionCheckResult} from '../../shared/types/mutations_core';
import {MutationTypes} from '../types/mutations';

/**
 * Model class representing the current user's session.
 *
 * @example
 * ```js
 * import {useSession} from '@airtable/blocks/base/ui';
 *
 * function Username() {
 *     const session = useSession();
 *
 *     if (session.currentUser !== null) {
 *         return <span>The current user's name is {session.currentUser.name}</span>;
 *     } else {
 *         return <span>This extension is being viewed in a public share</span>;
 *     }
 * }
 * ```
 * @docsPath models/Session
 */
class Session extends SessionCore<BaseSdkMode> {
    /** @internal */
    static _className = 'Session';
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
     * import {useSession} from '@airtable/blocks/base/ui';
     *
     * function UpdateButton({onClick}) {
     *     const session = useSession();
     *     const updateRecordsCheckResult = session.checkPermissionsForUpdateRecords();
     *     const deniedReason = updateRecordsCheckResult.hasPermission
     *         ? <span>{updateRecordsCheckResult.reasonDisplayString}</span>
     *         : null;
     *
     *     return <div>
     *         {deniedReason}
     *         <button onClick={onClick} disabled={!!deniedReason}>
     *             Update
     *         </button>
     *     </div>;
     * }
     */
    checkPermissionsForUpdateRecords(): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
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
     * import {useSession} from '@airtable/blocks/base/ui';
     *
     * function CreateButton({onClick}) {
     *     const session = useSession();
     *     const updateRecordsCheckResult = session.checkPermissionsForCreateRecords();
     *     const deniedReason = updateRecordsCheckResult.hasPermission
     *         ? <span>{updateRecordsCheckResult.reasonDisplayString}</span>
     *         : null;
     *
     *     return <div>
     *         {deniedReason}
     *         <button onClick={onClick} disabled={!!deniedReason}>
     *             Create
     *         </button>
     *     </div>;
     * }
     */
    checkPermissionsForCreateRecords(): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
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
     * import {useSession} from '@airtable/blocks/base/ui';
     *
     * function DeleteButton({onClick}) {
     *     const session = useSession();
     *     const updateRecordsCheckResult = session.checkPermissionsForDeleteRecords();
     *     const deniedReason = updateRecordsCheckResult.hasPermission
     *         ? <span>{updateRecordsCheckResult.reasonDisplayString}</span>
     *         : null;
     *
     *     return <div>
     *         {deniedReason}
     *         <button onClick={onClick} disabled={!!deniedReason}>
     *             Delete
     *         </button>
     *     </div>;
     */
    checkPermissionsForDeleteRecords(): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
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
}

export default Session;
