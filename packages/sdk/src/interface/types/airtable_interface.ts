import {
    type AirtableInterfaceCore,
    type AppInterface,
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
    initialSearchParams: Record<string, string>;
}

/** @hidden */
export interface IdGenerator {
    generateRecordId(): string;
}

/** @hidden */
export interface UrlConstructor {
    getAttachmentClientUrl(
        appInterface: AppInterface,
        attachmentId: string,
        attachmentUrl: string,
    ): string;
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

/** @hidden */
export interface SubElementSelectionState {
    subElementId: string;
    sourceLocation?: SourceLocation;
    name?: string;
}

/** @hidden */
interface SourceLocation {
    filePath: string;
    lineNumber: number;
    columnNumber?: number;
}

/** @hidden */
export type GetMapApiTokenResponse =
    | {
          success: true;
          apiKey: string;
          warningMessage?: string;
      }
    | {
          success: false;
          userFriendlyErrorMessage: string;
          suggestedOmniPrompt?: string;
      };

/**
 * AirtableInterface is designed as the communication interface between the
 * Block SDK and Airtable.
 *
 * @hidden
 */
export interface AirtableInterface extends AirtableInterfaceCore<InterfaceSdkMode> {
    idGenerator: IdGenerator;
    urlConstructor: UrlConstructor;

    expandRecord(tableId: string, recordId: string): void;
    openCommentsPanel(tableId: string, recordId: string): void;
    openRevisionHistory(tableId: string, recordId: string): void;
    fetchForeignRecordsAsync(
        tableId: string,
        recordId: string,
        fieldId: string,
        filterString: string,
    ): Promise<{records: ReadonlyArray<{id: RecordId; name: string}>}>;
    setCustomPropertiesAsync(
        properties: Array<BlockInstallationPageElementCustomPropertyForAirtableInterface>,
    ): Promise<boolean>;
    setSelectedSubElementAsync(
        selectedSubElement: SubElementSelectionState | null,
    ): Promise<boolean>;
    fetchAndSubscribeToSelectionDataAsync(
        callback: (data: {selectedSubElementId: string | null}) => void,
    ): Promise<{selectedSubElementId: string | null}>;
    unsubscribeFromSelectionData(): void;
    getMapApiTokenAsync?(): Promise<GetMapApiTokenResponse>;
    setSearchParamsAsync(searchParams: Record<string, string>): Promise<boolean>;
    subscribeToSearchParamsUpdates(
        callback: (data: {searchParams: Record<string, string>}) => void,
    ): void;
    loadDynamicQueryAsync(args: {
        key: string;
        tableId: string;
        fieldIds: ReadonlyArray<string>;
        recordIds: ReadonlyArray<string> | null;
    }): Promise<void>;
    unloadDynamicQuery(args: {key: string}): void;
}
