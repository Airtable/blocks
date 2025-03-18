import {BaseCore} from '../../shared/models/base_core';
import {InterfaceSdkMode} from '../../sdk_mode';
import {TableId} from '../../shared/types/hyper_ids';
import Table from './table';

/** @hidden */
class Base extends BaseCore<InterfaceSdkMode> {
    /** @internal */
    _constructTable(tableId: TableId): Table {
        return new Table(this, tableId, this._sdk);
    }
}

export default Base;
