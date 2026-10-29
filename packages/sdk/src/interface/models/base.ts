import {BaseCore, type ChangedPathsForType, WatchableBaseKeys} from '../../shared/models/base_core';
import {spawnError} from '../../shared/error_utils';
import {type InterfaceSdkMode} from '../../sdk_mode';
import {type CollaboratorData} from '../../shared/types/collaborator';
import {type TableId} from '../../shared/types/hyper_ids';
import {type InterfaceBlockSdk} from '../sdk';
import {type BaseData} from '../types/base';
import {Table} from './table';
import {RecordStore} from './record_store';

/**
 * Model class representing a base.
 *
 * If you want the base model to automatically recalculate whenever the base schema changes, try the
 * {@link useBase} hook.
 *
 * @docsPath models/Base
 */
export class Base extends BaseCore<InterfaceSdkMode> {
    /** @internal */
    _constructTable(tableId: TableId): Table {
        const recordStore = this.__getRecordStore(tableId);
        return new Table(this, recordStore, tableId, this._sdk);
    }

    /** @internal */
    _constructRecordStore(sdk: InterfaceBlockSdk, tableId: TableId): RecordStore {
        return new RecordStore(sdk, tableId);
    }

    /** @internal */
    _getAllTableDataForEditModeConfiguration(): BaseData['allTableDataForEditModeConfiguration'] {
        return this._data.allTableDataForEditModeConfiguration;
    }

    /**
     * Searches the users of this base's enterprise account by name or email, the way the native
     * User field picker does. Unlike {@link activeCollaborators}, the results are not limited to
     * users who have access to this base, so this is the way to pick a user before creating the
     * record that will reference them.
     *
     * Only the matching users are returned, with their `id`, `name` and `email`, and at most `limit`
     * of them. Queries shorter than two characters return no users. Airtable must enable this
     * capability for the base, otherwise the promise rejects.
     *
     * @param filterString The text to search for, matched case-insensitively against each user's
     * full name and email address.
     * @param opts.limit The maximum number of users to return. Defaults to 50; may not exceed 100.
     *
     * @example
     * ```js
     * import {useBase} from '@airtable/blocks/interface/ui';
     *
     * function UserSearch() {
     *     const base = useBase();
     *     const [users, setUsers] = useState([]);
     *     return (
     *         <div>
     *             <input
     *                 onChange={async (e) => {
     *                     const result = await base.fetchEnterpriseUsersAsync(e.target.value);
     *                     setUsers(result.users);
     *                 }}
     *             />
     *             {users.map((user) => <div key={user.id}>{user.name} ({user.email})</div>)}
     *         </div>
     *     );
     * }
     * ```
     */
    fetchEnterpriseUsersAsync(
        filterString: string,
        opts: {limit?: number} = {},
    ): Promise<{users: ReadonlyArray<CollaboratorData>}> {
        if (typeof filterString !== 'string') {
            throw spawnError('filterString must be a string');
        }
        const {limit} = opts;
        if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
            throw spawnError('limit must be a positive integer');
        }
        return this.__sdk.__airtableInterface.fetchEnterpriseUsersAsync(filterString, limit);
    }

    /** @internal */
    __triggerOnChangeForChangedPaths(changedPaths: ChangedPathsForType<BaseData>): void {
        super.__triggerOnChangeForChangedPaths(changedPaths);

        if (changedPaths.allTableDataForEditModeConfiguration) {
            this._onChange(WatchableBaseKeys.schema);
        }
    }
}
