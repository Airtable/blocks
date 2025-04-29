import {TableCore} from '../../shared/models/table_core';
import {InterfaceSdkMode} from '../../sdk_mode';
import {FieldId} from '../../shared/types/hyper_ids';
import {Field} from './field';

/**
 * Model class representing a table. Every {@link Base} has one or more tables.
 *
 * @example
 * ```js
 * import {useBase} from '@airtable/blocks/interface/ui';
 *
 * function App() {
 *     const base = useBase();
 *     const table = base.getTables()[0];
 *     if (table) {
 *         console.log('The name of this table is', table.name);
 *     }
 * }
 * ```
 * @docsPath models/Table
 */
export class Table extends TableCore<InterfaceSdkMode> {
    /** @internal */
    _constructField(fieldId: FieldId): Field {
        return new Field(this.parentBase.__sdk, this, fieldId);
    }
}
