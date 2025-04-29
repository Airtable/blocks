import {InterfaceSdkMode} from '../../sdk_mode';
import {FieldCore} from '../../shared/models/field_core';

/**
 * Model class representing a field in a table.
 *
 * @example
 * ```js
 * import {useBase} from '@airtable/blocks/interface/ui';
 *
 * function App() {
 *     const base = useBase();
 *     const table = base.getTableByName('Table 1');
 *     const field = table.getFieldByName('Name');
 *     console.log('The type of this field is', field.type);
 * }
 * ```
 * @docsPath models/Field
 */
export class Field extends FieldCore<InterfaceSdkMode> {
    /** @internal */
    static _className = 'Field';
}
