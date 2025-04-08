import {AirtableInterfaceCore, SdkInitDataCore} from '../../shared/types/airtable_interface_core';
import {InterfaceSdkMode} from '../../sdk_mode';
import {BaseDataCore} from '../../shared/types/base_core';
import {TableData} from './table';

// BlockRunContextType, BlockInstallationPageBlockRunContext, ViewBlockRunContext, BlockRunContext
// must be kept in sync with block_run_context.tsx in hyperbase repo
/** @hidden */
export enum BlockRunContextType {
    PAGE_ELEMENT_IN_QUERY_CONTAINER = 'pageElementInQueryContainer',
}

/** @hidden */
export interface PageElementInQueryContainerBlockRunContextType {
    type: BlockRunContextType.PAGE_ELEMENT_IN_QUERY_CONTAINER;
}

/** @hidden */
export type BlockRunContext = PageElementInQueryContainerBlockRunContextType;

/** @hidden */
export interface SdkInitData extends SdkInitDataCore {
    runContext: BlockRunContext;
    baseData: BaseDataCore<TableData>;
}

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
}
