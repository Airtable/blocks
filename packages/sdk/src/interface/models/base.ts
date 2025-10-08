import {BaseCore} from '../../shared/models/base_core';
import {type InterfaceSdkMode} from '../../sdk_mode';
import {type TableId} from '../../shared/types/hyper_ids';
import {type InterfaceBlockSdk} from '../sdk';
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
}
