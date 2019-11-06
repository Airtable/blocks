/** @module @airtable/blocks/ui: FieldPicker */ /** */
import * as React from 'react';
import getSdk from '../get_sdk';
import Field from '../models/field';
import {GlobalConfigKey} from '../global_config';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import FieldPicker, {sharedFieldPickerPropTypes, SharedFieldPickerProps} from './field_picker';
import useSynced from './use_synced';
import useWatchable from './use_watchable';

/**
 * Props for the {@link FieldPickerSynced} component. Also accepts:
 * * {@link SharedFieldPickerProps}
 *
 * @noInheritDoc
 */
interface FieldPickerSyncedProps extends SharedFieldPickerProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected field will always reflect the field id stored in {@link GlobalConfig} for this key. Selecting a new field will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A wrapper around the {@link FieldPicker} component that syncs with {@link GlobalConfig}.
 *
 * @example
 * ```js
 * import {TablePickerSynced, FieldPickerSynced, useBase, useWatchable} from '@airtable/blocks/ui';
 * import {fieldTypes} from '@airtable/blocks/models';
 * import {globalConfig} from '@airtable/blocks';
 * import React, {Fragment} from 'react';
 *
 * function Block() {
 *     const base = useBase();
 *     const tableId = globalConfig.get('tableId');
 *     const table = base.getTableByIdIfExists(tableId);
 *     const fieldId = globalConfig.get('fieldId');
 *     const field = table.getFieldByIdIfExists(fieldId);
 *     useWatchable(globalConfig, ['tableId', 'fieldId']);
 *
 *     const summaryText = field ? `The field type for ${field.name} is ${field.type}.` : 'No field selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label style={{display: 'block', marginBottom: 16}}>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePickerSynced
 *                     globalConfigKey='tableId'
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *             {table && (
 *                 <label>
 *                     <div style={{marginBottom: 8, fontWeight: 500}}>Field</div>
 *                     <FieldPickerSynced
 *                         table={table}
 *                         globalConfigKey='fieldId'
 *                         allowedTypes={[
 *                             fieldTypes.SINGLE_LINE_TEXT,
 *                             fieldTypes.MULTILINE_TEXT,
 *                             fieldTypes.EMAIL,
 *                             fieldTypes.URL,
 *                             fieldTypes.PHONE_NUMBER,
 *                         ]}
 *                         shouldAllowPickingNone={true}
 *                     />
 *                 </label>
 *             )}
 *         </Fragment>
 *     );
 * }
 * ```
 */
function FieldPickerSynced(props: FieldPickerSyncedProps, ref: React.Ref<HTMLSelectElement>) {
    const {globalConfigKey, onChange, disabled, table, ...restOfProps} = props;
    const {value: fieldId, canSetValue: canSetFieldId, setValue: setFieldId} = useSynced(
        globalConfigKey,
    );

    useWatchable(getSdk().base, ['tables']);
    useWatchable(table, ['fields']);

    function _getFieldFromGlobalConfigValue(): Field | null {
        if (!table || table.isDeleted) {
            return null;
        }
        return typeof fieldId === 'string' && table ? table.getFieldByIdIfExists(fieldId) : null;
    }

    return (
        <FieldPicker
            {...restOfProps}
            ref={ref}
            table={table}
            field={_getFieldFromGlobalConfigValue()}
            onChange={field => {
                setFieldId(field ? field.id : null);
                if (onChange) {
                    onChange(field);
                }
            }}
            disabled={disabled || !canSetFieldId}
        />
    );
}

const ForwardedRefFieldPickerSynced = React.forwardRef<HTMLSelectElement, FieldPickerSyncedProps>(
    FieldPickerSynced,
);

ForwardedRefFieldPickerSynced.displayName = 'FieldPickerSynced';

ForwardedRefFieldPickerSynced.propTypes = {
    globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
    ...sharedFieldPickerPropTypes,
};

export default ForwardedRefFieldPickerSynced;
