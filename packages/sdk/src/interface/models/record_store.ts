import {RecordId} from '../../shared/types/hyper_ids';
import {InterfaceSdkMode} from '../../sdk_mode';
import RecordStoreCore from '../../shared/models/record_store_core';
import Record from './record';
import Table from './table';

/**
 * One RecordStore exists per table, and contains all the record data associated with that table.
 * Table itself is for schema information only, so isn't the appropriate place for this data.
 *
 * @internal
 */
class RecordStore extends RecordStoreCore<InterfaceSdkMode> {
    static _className = 'RecordStore';

    _constructRecord(recordId: RecordId, parentTable: Table): Record {
        return new Record(this._sdk, this, parentTable, recordId);
    }
}

/** @internal */
export default RecordStore;
