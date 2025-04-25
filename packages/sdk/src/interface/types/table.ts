import {TableDataCore} from '../../shared/types/table_core';
import {RecordId} from '../../shared/types/hyper_ids';
import {ObjectMap} from '../../shared/private_utils';
import {RecordData} from './record';

/** @hidden */
export interface TableData extends TableDataCore {
    recordsById: ObjectMap<RecordId, RecordData>;
    recordOrder: Array<RecordId>;
}
