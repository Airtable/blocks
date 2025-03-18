import {TableDataCore} from '../../shared/types/table_core';
import {ViewId} from '../../shared/types/hyper_ids';
import {ObjectMap} from '../../private_utils';
import {ViewData} from './view';

/** @hidden */
export interface TableData extends TableDataCore {
    activeViewId: ViewId | null;
    viewOrder: Array<ViewId>;
    viewsById: ObjectMap<ViewId, ViewData>;
}
