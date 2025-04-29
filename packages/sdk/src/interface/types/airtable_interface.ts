import {AirtableInterfaceCore, SdkInitDataCore} from '../../shared/types/airtable_interface_core';
import {InterfaceSdkMode} from '../../sdk_mode';
import {BaseDataCore} from '../../shared/types/base_core';
import {TableId, PageId, FieldId} from '../../shared/types/hyper_ids';
import {TableData} from './table';

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

/** @hidden */
export enum BlockInstallationPageElementCustomPropertyTypeForAirtableInterface {
    BOOLEAN = 'boolean',
    STRING = 'string',
    ENUM = 'enum',
    FIELD_ID = 'fieldId',
}

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
