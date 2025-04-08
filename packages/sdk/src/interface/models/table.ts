import {TableCore} from '../../shared/models/table_core';
import {InterfaceSdkMode} from '../../sdk_mode';
import {FieldId} from '../../shared/types/hyper_ids';
import Field from './field';

/** @hidden */
class Table extends TableCore<InterfaceSdkMode> {
    /** @internal */
    _constructField(fieldId: FieldId): Field {
        return new Field(this.parentBase.__sdk, this, fieldId);
    }
}

export default Table;
