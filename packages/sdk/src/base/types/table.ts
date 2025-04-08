import {TableDataCore} from '../../shared/types/table_core';
import {RecordId, ViewId} from '../../shared/types/hyper_ids';
import {ObjectMap} from '../../shared/private_utils';
import {ViewData} from './view';
import {RecordData} from './record';

/** @hidden */
export interface TableData extends TableDataCore {
    activeViewId: ViewId | null;
    viewOrder: Array<ViewId>;
    viewsById: ObjectMap<ViewId, ViewData>;
    // recordsById will be absent until the block explicitly loads the table's data.
    recordsById?: ObjectMap<RecordId, RecordData>;
}
