import {TableCore} from '../../shared/models/table_core';
import {InterfaceSdkMode} from '../../sdk_mode';
import {FieldId, RecordId} from '../../shared/types/hyper_ids';
import {PermissionCheckResult} from '../../shared/types/mutations_core';
import {FieldType} from '../../shared/types/field_core';
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

    /**
     * Checks whether records in this table can be expanded.
     *
     * Returns `{hasPermission: true}` if records can be expanded,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise.
     *
     * @example
     * ```js
     * const expandRecordsCheckResult = table.checkPermissionToExpandRecords();
     * if (!expandRecordsCheckResult.hasPermission) {
     *     alert(expandRecordsCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionToExpandRecords(): PermissionCheckResult {
        const canExpand = this._baseData.tablesById[this.id].isRecordExpansionEnabled;
        return canExpand
            ? {hasPermission: true}
            : {
                  hasPermission: false,
                  reasonDisplayString: 'Record expansion is not enabled for this table',
              };
    }

    /**
     * An alias for `checkPermissionsForExpandRecords().hasPermission`.
     *
     * Whether records in this table can be expanded.
     *
     * @example
     * ```js
     * const isRecordExpansionEnabled = table.hasPermissionToExpandRecords();
     * if (isRecordExpansionEnabled) {
     *     expandRecord(record);
     * }
     * ```
     */
    hasPermissionToExpandRecords(): boolean {
        return this.checkPermissionToExpandRecords().hasPermission;
    }

    /** @internal */
    _adjustCellValueForFieldIfNecessary(
        field: Field,
        cellValue: unknown,
        onGenerateIdForNewForeignRecord: (recordId: RecordId) => void,
    ): unknown {
        if (field.type !== FieldType.MULTIPLE_RECORD_LINKS || !Array.isArray(cellValue)) {
            return cellValue;
        }
        return cellValue.map(item => {
            if (typeof item !== 'object' || item === null) {
                return item;
            }

            if (!item.id) {
                const newForeignRecordId = this.parentBase.__sdk.__airtableInterface.idGenerator.generateRecordId();
                onGenerateIdForNewForeignRecord(newForeignRecordId);
                return {
                    ...item,
                    id: newForeignRecordId,
                };
            }
            return item;
        });
    }
}
