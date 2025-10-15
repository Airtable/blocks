/** @module @airtable/blocks/interface/ui: useCustomProperties */ /** */
import {useState, useEffect} from 'react';
import {type InterfaceSdkMode} from '../../sdk_mode';
import {useSdk} from '../../shared/ui/sdk_context';
import {
    type BlockInstallationPageElementCustomPropertyForAirtableInterface,
    BlockInstallationPageElementCustomPropertyTypeForAirtableInterface,
} from '../types/airtable_interface';
import useGlobalConfig from '../../shared/ui/use_global_config';
import {type Table} from '../models/table';
import type GlobalConfig from '../../shared/global_config';
import {type Base} from '../models/base';
import {spawnUnknownSwitchCaseError} from '../../shared/error_utils';
import {type Field} from '../models/field';
import {type FieldConfig} from '../models/models';
import {type FieldId} from '../../shared/types/hyper_ids';
import {type BaseData} from '../types/base';
import {type FieldDataCore} from '../../shared/types/field_core';
import {type ObjectMap} from '../../shared/private_utils';
import {type FieldTypeConfig} from '../../shared/types/airtable_interface_core';

/**
 * An object that represents a custom property that a block can set.
 *
 * ```
 * type BlockPageElementCustomProperty = {key: string; label: string} & (
 *   | {type: 'boolean'; defaultValue: boolean}
 *   | {type: 'string'; defaultValue?: string}
 *   | {
 *       type: 'enum';
 *       possibleValues: Array<{value: string; label: string}>;
 *       defaultValue?: string;
 *     }
 *   | {
 *       type: 'field';
 *       table: Table;
 *       possibleValues?: Array<Field>; // If not provided, all visible fields in the table will be shown in the dropdown.
 *       defaultValue?: Field;
 *     }
 *   | {
 *       type: 'table';
 *       defaultValue?: Table;
 *     }
 * );
 * ```
 */
type BlockPageElementCustomProperty = {key: string; label: string} & (
    | {type: 'boolean'; defaultValue: boolean}
    | {type: 'string'; defaultValue?: string}
    | {
          type: 'enum';
          possibleValues: Array<{value: string; label: string}>;
          defaultValue?: string;
      }
    | {
          type: 'field';
          table: Table;
          /** @deprecated Prefer `shouldFieldBeAllowed` instead. If not provided, all visible fields in the table will be shown in the dropdown. */
          possibleValues?: Array<Field>;
          /** If provided, it will be used to filter the fields in the dropdown. */
          shouldFieldBeAllowed?: (field: {id: FieldId; config: FieldConfig}) => boolean;
          defaultValue?: Field;
      }
    | {
          type: 'table';
          defaultValue?: Table;
      }
);

/**
 * A hook for integrating configuration settings for your block with the Interface Designer properties
 * panel. Under the hood, this uses {@link GlobalConfig} to store the custom property values.
 *
 * Returns an object with:
 * - `customPropertyValueByKey`: an object mapping custom property keys to their current value.
 * - `errorState`: an object with an `error` property if there was an error setting the custom properties
 *
 * @param getCustomProperties A function that returns an array of {@link BlockPageElementCustomProperty}.
 * This function should have a stable identity, so it should either be defined at the top level of the
 * file or wrapped in useCallback. It will receive an instance of {@link Base} as an argument.
 *
 * @example
 * ```js
 * import {useCustomProperties} from '@airtable/blocks/interface/ui';
 *
 * function getCustomProperties(base: Base) {
 *     const table = base.tables[0];
 *     const isNumberField = (field: {id: FieldId, config: FieldConfig}) => field.config.type === FieldType.NUMBER;
 *     return [
 *         {key: 'title', label: 'Title', type: 'string', defaultValue: 'Chart'},
 *         {key: 'xAxis', label: 'X-axis', type: 'field', table, shouldFieldBeAllowed: isNumberField},
 *         {key: 'yAxis', label: 'Y-axis', type: 'field', table, shouldFieldBeAllowed: isNumberField},
 *         {key: 'color', label: 'Color', type: 'enum', possibleValues: [{value: 'red', label: 'Red'}, {value: 'blue', label: 'Blue'}, {value: 'green', label: 'Green'}], defaultValue: 'red'},
 *         {key: 'showLegend', label: 'Show Legend', type: 'boolean', defaultValue: true},
 *     ];
 * }
 *
 * function MyApp() {
 *     const {customPropertyValueByKey, errorState} = useCustomProperties(getCustomProperties);
 * }
 * ```
 * @docsPath UI/hooks/useCustomProperties
 * @hook
 */
export function useCustomProperties(
    getCustomProperties: (base: Base) => Array<BlockPageElementCustomProperty>,
): {customPropertyValueByKey: {[key: string]: unknown}; errorState: {error: Error} | null} {
    const sdk = useSdk<InterfaceSdkMode>();
    const [customProperties, setCustomProperties] = useState<
        ReadonlyArray<BlockPageElementCustomProperty>
    >(() => {
        return getCustomProperties(sdk.base);
    });
    const globalConfig = useGlobalConfig();
    const [errorState, setErrorState] = useState<{error: Error} | null>(null);

    useEffect(() => {
        const base = sdk.base;
        const onSchemaChange = (base: Base) => {
            const customProperties = getCustomProperties(base);
            setCustomProperties(customProperties);
        };
        base.watch('schema', onSchemaChange);
        return () => {
            base.unwatch('schema', onSchemaChange);
        };
    }, [sdk, getCustomProperties]);

    const hasError = errorState !== null;
    useEffect(() => {
        if (hasError) {
            return;
        }
        const customPropertiesForAirtableInterface = customProperties.map((customProperty) =>
            convertBlockPageElementCustomPropertyToBlockInstallationPageElementCustomPropertyForAirtableInterface(
                sdk.base._getAllTableDataForEditModeConfiguration(),
                (fieldData, fieldNamesById) =>
                    sdk.__airtableInterface.fieldTypeProvider.getConfig(
                        sdk.__appInterface,
                        fieldData,
                        fieldNamesById,
                    ),
                customProperty,
            ),
        );
        sdk.setCustomPropertiesAsync(customPropertiesForAirtableInterface).catch((error) => {
            setErrorState({error});
        });
    }, [sdk, customProperties, hasError]);

    const customPropertyValueByKey = hasError
        ? {}
        : Object.fromEntries(
              customProperties.map((property) => [
                  property.key,
                  getCustomPropertyValue(sdk.base, globalConfig, property),
              ]),
          );

    return {
        customPropertyValueByKey,
        errorState,
    };
}

/** @internal */
function convertBlockPageElementCustomPropertyToBlockInstallationPageElementCustomPropertyForAirtableInterface(
    allTableDataForEditModeConfiguration:
        | BaseData['allTableDataForEditModeConfiguration']
        | undefined,
    getFieldConfig: (
        fieldData: Pick<FieldDataCore, 'type' | 'typeOptions'>,
        fieldNamesById: ObjectMap<FieldId, string>,
    ) => FieldTypeConfig,
    property: BlockPageElementCustomProperty,
): BlockInstallationPageElementCustomPropertyForAirtableInterface {
    switch (property.type) {
        case 'boolean':
            return {
                key: property.key,
                label: property.label,
                type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.BOOLEAN,
                defaultValue: property.defaultValue,
            };
        case 'string':
            return {
                key: property.key,
                label: property.label,
                type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.STRING,
                defaultValue: property.defaultValue,
            };
        case 'enum':
            return {
                key: property.key,
                label: property.label,
                type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.ENUM,
                possibleValues: property.possibleValues,
                defaultValue: property.defaultValue,
            };
        case 'field': {
            let possibleValues: Array<FieldId> | undefined;
            if (!allTableDataForEditModeConfiguration) {
                possibleValues = undefined;
            } else if (property.possibleValues) {
                possibleValues = property.possibleValues.map((field) => field.id);
            } else if (property.shouldFieldBeAllowed) {
                const shouldFieldBeAllowed = property.shouldFieldBeAllowed;
                const tableData = allTableDataForEditModeConfiguration[property.table.id];
                if (!tableData) {
                    possibleValues = [];
                } else {
                    const fieldNamesById = Object.fromEntries(
                        Object.entries(tableData.fieldsById).map(([id, field]) => [id, field.name]),
                    );
                    possibleValues = Object.values(tableData.fieldsById)
                        .filter((field) =>
                            shouldFieldBeAllowed({
                                id: field.id,
                                config: getFieldConfig(field, fieldNamesById) as FieldConfig,
                            }),
                        )
                        .map((field) => field.id);
                }
            } else {
                possibleValues = undefined;
            }
            return {
                key: property.key,
                label: property.label,
                type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.FIELD_ID,
                tableId: property.table.id,
                possibleValues,
                defaultValue: property.defaultValue?.id,
            };
        }
        case 'table':
            return {
                key: property.key,
                label: property.label,
                type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.TABLE_ID,
                defaultValue: property.defaultValue?.id,
            };
        default:
            throw spawnUnknownSwitchCaseError('property type', property, 'type');
    }
}

/** @internal */
function getCustomPropertyValue(
    base: Base,
    globalConfig: GlobalConfig,
    property: BlockPageElementCustomProperty,
): unknown {
    const defaultValue = 'defaultValue' in property ? property.defaultValue : null;
    const rawValue = globalConfig.get(property.key) ?? defaultValue;

    switch (property.type) {
        case 'boolean': {
            if (typeof rawValue === 'boolean') {
                return rawValue;
            }
            return defaultValue;
        }
        case 'string': {
            if (typeof rawValue === 'string') {
                return rawValue;
            }
            return defaultValue;
        }
        case 'enum': {
            if (
                typeof rawValue === 'string' &&
                property.possibleValues.some((value) => value.value === rawValue)
            ) {
                return rawValue;
            }
            return defaultValue;
        }
        case 'field': {
            if (
                typeof rawValue === 'string' &&
                property.table === base.getTableById(property.table.id)
            ) {
                const fieldModel = property.table.fields.find((field) => field.id === rawValue);
                if (fieldModel) {
                    if (property.possibleValues) {
                        if (property.possibleValues.includes(fieldModel)) {
                            return fieldModel;
                        }
                        return defaultValue;
                    } else if (property.shouldFieldBeAllowed) {
                        if (
                            property.shouldFieldBeAllowed({
                                id: fieldModel.id,
                                config: {
                                    type: fieldModel.type,
                                    options: fieldModel.options,
                                } as FieldConfig,
                            })
                        ) {
                            return fieldModel;
                        }
                        return defaultValue;
                    } else {
                        return fieldModel;
                    }
                }
            }
            return defaultValue;
        }
        case 'table': {
            if (typeof rawValue === 'string') {
                const tableIfExists = base.getTableByIdIfExists(rawValue);
                if (tableIfExists) {
                    return tableIfExists;
                }
            }
            return defaultValue;
        }
        default:
            throw spawnUnknownSwitchCaseError('property type', property, 'type');
    }
}
