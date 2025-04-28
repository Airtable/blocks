import {AirtableInterfaceCore, SdkInitDataCore} from '../../shared/types/airtable_interface_core';
import {InterfaceSdkMode} from '../../sdk_mode';
import {BaseDataCore} from '../../shared/types/base_core';
import {TableId, PageId, FieldId} from '../../shared/types/hyper_ids';
import {TableData} from './table';

// BlockRunContextType, BlockInstallationPageBlockRunContext, BlockRunContext
// must be kept in sync with block_run_context.tsx in hyperbase repo
/** @hidden */
export enum BlockRunContextType {
    PAGE_ELEMENT_IN_QUERY_CONTAINER = 'pageElementInQueryContainer',
}

/** @hidden */
export interface PageElementInQueryContainerBlockRunContextType {
    type: BlockRunContextType.PAGE_ELEMENT_IN_QUERY_CONTAINER;
    pageId: PageId;
    isPageElementInEditMode: boolean;
}

/** @hidden */
export type BlockRunContext = PageElementInQueryContainerBlockRunContextType;

/** @hidden */
export interface SdkInitData extends SdkInitDataCore {
    runContext: BlockRunContext;
    baseData: BaseDataCore<TableData>;
}

// Keep in sync with enum in hyperbase repo:
// https://github.com/Hyperbase/hyperbase/blob/2c0e2ef2cbc6bce7ab33fd913ef3572a83c3892d/client_server_shared/pages/types/block_installation_page_elements/block_installation_page_element_custom_properties_types.tsx
/** @hidden */
export enum BlockInstallationPageElementCustomPropertyTypeForAirtableInterface {
    BOOLEAN = 'boolean',
    STRING = 'string',
    ENUM = 'enum',
    FIELD_ID = 'fieldId',
}

// Keep in sync with type in hyperbase repo:
// https://github.com/Hyperbase/hyperbase/blob/2c0e2ef2cbc6bce7ab33fd913ef3572a83c3892d/client_server_shared/pages/types/block_installation_page_elements/block_installation_page_element_custom_properties_types.tsx
/** @hidden */
export type BlockInstallationPageElementCustomPropertyForAirtableInterface = {
    key: string;
    label: string;
} & (
    | {
          type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.BOOLEAN;
          defaultValue: boolean;
      }
    | {
          type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.STRING;
          defaultValue?: string;
      }
    | {
          type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.ENUM;
          possibleValues: Array<{value: string; label: string}>;
          defaultValue?: string;
      }
    | {
          type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.FIELD_ID;
          tableId: TableId;
          possibleValues?: Array<FieldId>;
          defaultValue?: FieldId;
      }
);

/**
 * AirtableInterface is designed as the communication interface between the
 * Block SDK and Airtable. The mechanism through which we communicate with Airtable
 * depends on the context in which the block is running (i.e. frontend or backend),
 * but the interface should remain consistent.
 *
 * @hidden
 */
export interface AirtableInterface extends AirtableInterfaceCore<InterfaceSdkMode> {
    sdkInitData: SdkInitData;

    expandRecord(tableId: string, recordId: string): void;
    setCustomPropertiesAsync(
        properties: Array<BlockInstallationPageElementCustomPropertyForAirtableInterface>,
    ): Promise<boolean>;
}
