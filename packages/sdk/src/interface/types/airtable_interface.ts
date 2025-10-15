import {
    type AirtableInterfaceCore,
    type SdkInitDataCore,
} from '../../shared/types/airtable_interface_core';
import {type InterfaceSdkMode} from '../../sdk_mode';
import {type TableId, type PageId, type FieldId, type RecordId} from '../../shared/types/hyper_ids';
import {type BaseData} from './base';

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
    baseData: BaseData;
}

/** @hidden */
export interface IdGenerator {
    generateRecordId(): string;
}

/** @hidden */
export enum BlockInstallationPageElementCustomPropertyTypeForAirtableInterface {
    BOOLEAN = 'boolean',
    STRING = 'string',
    ENUM = 'enum',
    FIELD_ID = 'fieldId',
    TABLE_ID = 'tableId',
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
    | {
          type: BlockInstallationPageElementCustomPropertyTypeForAirtableInterface.TABLE_ID;
          defaultValue?: TableId;
      }
);

/**
 * AirtableInterface is designed as the communication interface between the
 * Block SDK and Airtable.
 *
 * @hidden
 */
export interface AirtableInterface extends AirtableInterfaceCore<InterfaceSdkMode> {
    idGenerator: IdGenerator;

    expandRecord(tableId: string, recordId: string): void;
    fetchForeignRecordsAsync(
        tableId: string,
        recordId: string,
        fieldId: string,
        filterString: string,
    ): Promise<{records: ReadonlyArray<{id: RecordId; name: string}>}>;
    setCustomPropertiesAsync(
        properties: Array<BlockInstallationPageElementCustomPropertyForAirtableInterface>,
    ): Promise<boolean>;
}
