/** @module @airtable/blocks/interface/ui: useCustomProperties */ /** */
import {useState, useEffect} from 'react';
import {InterfaceSdkMode} from '../../sdk_mode';
import {useSdk} from '../../shared/ui/sdk_context';
import {
    BlockInstallationPageElementCustomPropertyForAirtableInterface,
    BlockInstallationPageElementCustomPropertyTypeForAirtableInterface,
} from '../types/airtable_interface';
import useGlobalConfig from '../../shared/ui/use_global_config';
import {Table} from '../models/table';
import GlobalConfig from '../../shared/global_config';
import {Base} from '../models/base';
import {spawnUnknownSwitchCaseError} from '../../shared/error_utils';
import {Field} from '../models/field';

/**
 * TODO document
 * @hidden
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
          /** If not provided, all visible fields in the table will be shown in the dropdown. */
          possibleValues?: Array<Field>;
          defaultValue?: Field;
      }
);

/**
 * TODO document. Make sure to describe that getCustomProperties
 * should be wrapped in useCallback.
 * @hidden
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
        const customPropertiesForAirtableInterface = customProperties.map(
            convertBlockPageElementCustomPropertyToBlockInstallationPageElementCustomPropertyForAirtableInterface,
        );
        sdk.setCustomPropertiesAsync(customPropertiesForAirtableInterface).catch(error => {
            setErrorState({error});
        });
    }, [sdk, customProperties, hasError]);

    const customPropertyValueByKey = hasError
        ? {}
        : Object.fromEntries(
              customProperties.map(property => [
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
        case 'field':
            return {
                key: property.key,
                label: property.label,
                type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.FIELD_ID,
                tableId: property.table.id,
                possibleValues: property.possibleValues?.map(field => field.id),
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
        case 'boolean':
            if (typeof rawValue === 'boolean') {
                return rawValue;
            }
            return defaultValue;
        case 'string':
            if (typeof rawValue === 'string') {
                return rawValue;
            }
            return defaultValue;
        case 'enum':
            if (
                typeof rawValue === 'string' &&
                property.possibleValues.some(value => value.value === rawValue)
            ) {
                return rawValue;
            }
            return defaultValue;
        case 'field':
            if (
                typeof rawValue === 'string' &&
                property.table === base.getTableById(property.table.id)
            ) {
                const fieldModel = property.table.fields.find(field => field.id === rawValue);
                if (
                    fieldModel &&
                    (!property.possibleValues || property.possibleValues.includes(fieldModel))
                ) {
                    return fieldModel;
                }
            }
            return defaultValue;
        default:
            throw spawnUnknownSwitchCaseError('property type', property, 'type');
    }
}
