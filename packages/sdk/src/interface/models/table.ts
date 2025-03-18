import {TableCore} from '../../shared/models/table_core';
import {InterfaceSdkMode} from '../../sdk_mode';
import {FieldId} from '../../shared/types/hyper_ids';
import {spawnError} from '../../error_utils';

/** @hidden */
class Table extends TableCore<InterfaceSdkMode> {
    /** @internal */
    _constructField(fieldId: FieldId): never {
        throw spawnError('Method not implemented.');
    }
}

export default Table;
